/**
 * Paste this into Google Apps Script.
 * Deploy → New deployment → Web app → Execute as Me → Anyone.
 * After edits: Deploy → Manage deployments → pencil → New version.
 *
 * Optional script properties:
 *   LEAD_TOKEN = giftory-lead-2026
 *   LEAD_TO    = aravindgiftory@gmail.com
 *
 * Test mail from the editor: select testMail → Run (allow Gmail once).
 */

const DEFAULT_TO = "aravindgiftory@gmail.com";

function doGet(e) {
  if (e && e.parameter && e.parameter.payload) {
    return handleLead(e);
  }
  return jsonOutput({ ok: true, service: "giftory-leads" });
}

function doPost(e) {
  return handleLead(e);
}

function handleLead(e) {
  try {
    const data = parseLead(e);
    const expected = PropertiesService.getScriptProperties().getProperty("LEAD_TOKEN") || "";

    if (expected && data.token !== expected) {
      return jsonOutput({ ok: false, error: "Unauthorized" });
    }

    const to =
      PropertiesService.getScriptProperties().getProperty("LEAD_TO") || DEFAULT_TO;
    const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || "Guest";
    const source = data.source || "enquiry";
    const products = formatProducts(data);

    const body = [
      "New enquiry from the Aravind Giftory website.",
      "",
      "Source: " + source,
      "Name: " + name,
      "Phone: " + (data.phone || "—"),
      "Email: " + (data.email || "—"),
      "Company: " + (data.company || "—"),
      "Looking for: " + (data.lookingFor || "—"),
      "Catalogue: " + (data.catalogueChoice || "—"),
      "Occasion: " + (data.occasion || "—"),
      "Quantity: " + (data.quantity || "—"),
      "Budget per gift: " + (data.budget || "—"),
      "Event date: " + (data.eventDate || "—"),
      "Products: " + (products || "—"),
      "Page: " + (data.pageUrl || "—"),
      "Submitted: " + (data.submittedAt || new Date().toISOString()),
      "",
      "Message:",
      data.message || "—",
    ].join("\n");

    MailApp.sendEmail({
      to: to,
      subject: "Giftory enquiry · " + source + " · " + name,
      body: body,
      replyTo: data.email || to,
    });

    return jsonOutput({ ok: true });
  } catch (error) {
    return jsonOutput({ ok: false, error: String(error) });
  }
}

function testMail() {
  MailApp.sendEmail({
    to: DEFAULT_TO,
    subject: "Giftory test mail",
    body: "If you received this, Apps Script can send Gmail. Check Inbox and Spam.",
  });
}

function parseLead(e) {
  if (e && e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      return {};
    }
  }
  return {};
}

function formatProducts(data) {
  if (data.products && data.products.length) {
    return data.products
      .map(function (item) {
        return item.name + " (" + item.code + ")";
      })
      .join(", ");
  }
  if (data.productName) {
    return data.productName + (data.productCode ? " (" + data.productCode + ")" : "");
  }
  return "";
}

function jsonOutput(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
