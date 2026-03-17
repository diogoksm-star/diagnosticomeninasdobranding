import type { Handler } from "@netlify/functions";

const KOMMO_API_DOMAIN = "contatothewhole.kommo.com";

interface KommoContact {
  name: string;
  custom_fields_values?: {
    field_code: string;
    values: { value: string; enum_code?: string }[];
  }[];
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function createKommoContact(
  token: string,
  name: string,
  email: string,
  whatsapp: string
): Promise<number | null> {
  const customFields: KommoContact["custom_fields_values"] = [];

  if (email) {
    customFields.push({
      field_code: "EMAIL",
      values: [{ value: email, enum_code: "WORK" }],
    });
  }

  if (whatsapp) {
    const cleanPhone = whatsapp.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("55")
      ? cleanPhone
      : `55${cleanPhone}`;

    customFields.push({
      field_code: "PHONE",
      values: [{ value: formattedPhone, enum_code: "MOB" }],
    });
  }

  const contactPayload: KommoContact[] = [
    {
      name: name || "Visitante",
      ...(customFields.length > 0 && {
        custom_fields_values: customFields,
      }),
    },
  ];

  const response = await fetch(
    `https://${KOMMO_API_DOMAIN}/api/v4/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactPayload),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Kommo contact error: ${response.status} - ${errorText}`);
    return null;
  }

  const data = await response.json();
  return data?._embedded?.contacts?.[0]?.id ?? null;
}

async function createKommoLead(
  token: string,
  contactId: number,
  resultTitle: string,
  score: number,
  utmSource: string
): Promise<number | null> {
  const PIPELINE_ID = 13161040; // Funil "Quizz"
  const STATUS_ID = 101483528; // Etapa "Contato inicial"

  const leadPayload = [
    {
      name: `Diagnóstico - ${resultTitle}`,
      pipeline_id: PIPELINE_ID,
      status_id: STATUS_ID,
      _embedded: {
        contacts: [{ id: contactId }],
        tags: [{ name: "Diagnóstico" }, { name: resultTitle }],
      },
      custom_fields_values: [
        {
          field_code: "UTM_SOURCE",
          values: [{ value: utmSource || "direto" }],
        },
      ],
    },
  ];

  const response = await fetch(
    `https://${KOMMO_API_DOMAIN}/api/v4/leads`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadPayload),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Kommo lead error: ${response.status} - ${errorText}`);
    return null;
  }

  const data = await response.json();
  return data?._embedded?.leads?.[0]?.id ?? null;
}

async function addKommoNote(
  token: string,
  leadId: number,
  payload: Record<string, unknown>
): Promise<void> {
  const noteText = [
    `Resultado: ${payload.resultTitle}`,
    `Pontuação: ${payload.totalScore}/65`,
    `Nome: ${payload.name || "Não informado"}`,
    `Email: ${payload.email || "Não informado"}`,
    `WhatsApp: ${payload.whatsapp || "Não informado"}`,
    ``,
    `UTM Source: ${payload.utm_source || "-"}`,
    `UTM Medium: ${payload.utm_medium || "-"}`,
    `UTM Campaign: ${payload.utm_campaign || "-"}`,
    ``,
    `Respostas: ${JSON.stringify(payload.answers)}`,
  ].join("\n");

  const response = await fetch(
    `https://${KOMMO_API_DOMAIN}/api/v4/leads/${leadId}/notes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          note_type: "common",
          params: { text: noteText },
        },
      ]),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Kommo note error: ${response.status} - ${errorText}`);
  }
}

const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    console.log("Received payload:", JSON.stringify(payload));

    const kommoToken = process.env.KOMMO_ACCESS_TOKEN;
    if (!kommoToken) {
      console.warn("KOMMO_ACCESS_TOKEN not configured");
      return {
        statusCode: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, kommo: false, reason: "no_token" }),
      };
    }

    // Create contact in Kommo
    const contactId = await createKommoContact(
      kommoToken,
      payload.name || "Visitante",
      payload.email || "",
      payload.whatsapp || ""
    );

    let leadCreated = false;

    if (contactId) {
      // Create lead linked to contact
      const leadId = await createKommoLead(
        kommoToken,
        contactId,
        payload.resultTitle || "Sem resultado",
        payload.totalScore || 0,
        payload.utm_source || ""
      );

      // Add note with full details
      if (leadId) {
        await addKommoNote(kommoToken, leadId, payload);
        leadCreated = true;
      }
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, kommo: leadCreated }),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", message);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: message }),
    };
  }
};

export { handler };
