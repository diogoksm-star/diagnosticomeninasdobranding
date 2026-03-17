import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const KOMMO_API_DOMAIN = "contatothewhole.kommo.com";

interface KommoContact {
  name: string;
  custom_fields_values?: {
    field_code: string;
    values: { value: string; enum_code?: string }[];
  }[];
}

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
  const contactId = data?._embedded?.contacts?.[0]?.id;
  console.log("Kommo contact created:", contactId);
  return contactId;
}

async function createKommoLead(
  token: string,
  contactId: number,
  resultTitle: string,
  score: number,
  utmSource: string
): Promise<number | null> {
  const leadPayload = [
    {
      name: `Diagnóstico - ${resultTitle}`,
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
  const leadId = data?._embedded?.leads?.[0]?.id;
  console.log("Kommo lead created:", leadId);
  return leadId;
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
  } else {
    console.log("Kommo note added to lead", leadId);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Received payload:", JSON.stringify(payload));

    // 1. Save lead to Supabase database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from("leads").insert({
      name: payload.name || "",
      email: payload.email || "",
      whatsapp: payload.whatsapp || "",
      answers: payload.answers,
      score: payload.totalScore,
      classification: payload.resultTitle,
      result_id: payload.result || "",
      utm_source: payload.utm_source || "",
      utm_medium: payload.utm_medium || "",
      utm_campaign: payload.utm_campaign || "",
      utm_term: payload.utm_term || "",
      utm_content: payload.utm_content || "",
    });

    let dbStatus = "ok";
    if (dbError) {
      dbStatus = JSON.stringify(dbError);
      console.error("DB insert error:", dbStatus);
    } else {
      console.log("Lead saved to database");
    }

    // 2. Send to Kommo CRM via API v4
    const kommoToken = Deno.env.get("KOMMO_ACCESS_TOKEN");
    if (!kommoToken) {
      console.warn("KOMMO_ACCESS_TOKEN not configured, skipping CRM");
      return new Response(
        JSON.stringify({ success: true, kommo: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2a. Create contact
    const contactId = await createKommoContact(
      kommoToken,
      payload.name || "Visitante",
      payload.email || "",
      payload.whatsapp || ""
    );

    if (contactId) {
      // 2b. Create lead linked to contact
      const leadId = await createKommoLead(
        kommoToken,
        contactId,
        payload.resultTitle || "Sem resultado",
        payload.totalScore || 0,
        payload.utm_source || ""
      );

      // 2c. Add note with full details
      if (leadId) {
        await addKommoNote(kommoToken, leadId, payload);
      }
    }

    return new Response(
      JSON.stringify({ success: true, kommo: !!contactId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
