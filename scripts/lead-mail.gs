/**
 * Paste this into Google Apps Script.
 * Deploy → New deployment → Web app → Execute as Me → Anyone.
 * After edits: Deploy → Manage deployments → pencil → New version.
 *
 * Optional script properties (the website sends no token — never put a secret in frontend code):
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
    if (data.website) return jsonOutput({ ok: true }); // honeypot

    const to = PropertiesService.getScriptProperties().getProperty("LEAD_TO") || DEFAULT_TO;
    const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || "Guest";
    const source = data.source || "enquiry";
    const items = productItems(data);

    const fields = [
      ["Source", source],
      ["Name", name],
      ["Phone", data.phone],
      ["Email", data.email],
      ["Company", data.company],
      ["Looking for", data.lookingFor],
      ["Catalogue", data.catalogueChoice],
      ["Occasion", data.occasion],
      ["Quantity", data.quantity],
      ["Budget per gift", data.budget],
      ["Event date", data.eventDate],
      ["Submitted", data.submittedAt || new Date().toISOString()],
    ];

    // Plain-text version
    const text = ["New enquiry from the Aravind Giftory website.", ""]
      .concat(
        fields.map(function (f) {
          return f[0] + ": " + (f[1] || "—");
        }),
      )
      .concat(["", "Products:"])
      .concat(
        items.length
          ? items.map(function (i) {
              return "• " + i.label + (i.link ? "\n  " + i.link : "");
            })
          : ["—"],
      )
      .concat(["", "Message:", data.message || "—"])
      .join("\n");

    // HTML version with clickable product links
    const rows = fields
      .map(function (f) {
        return (
          "<tr><td style='padding:4px 12px 4px 0;color:#6b5a52'>" +
          esc(f[0]) +
          "</td><td style='padding:4px 0'>" +
          esc(f[1] || "—") +
          "</td></tr>"
        );
      })
      .join("");
    const list = items.length
      ? "<ul>" +
        items
          .map(function (i) {
            return (
              "<li>" +
              esc(i.label) +
              (i.link ? " — <a href='" + esc(i.link) + "'>" + esc(i.link) + "</a>" : "") +
              "</li>"
            );
          })
          .join("") +
        "</ul>"
      : "<p>—</p>";
    const html =
      "<div style='font-family:Arial,sans-serif;font-size:14px;color:#2a221e'>" +
      "<h2 style='color:#4d1a17;margin:0 0 12px'>New enquiry from the website</h2>" +
      "<table>" +
      rows +
      "</table><h3 style='color:#4d1a17'>Products</h3>" +
      list +
      "<h3 style='color:#4d1a17'>Message</h3><p>" +
      esc(data.message || "—").replace(/\n/g, "<br>") +
      "</p></div>";

    MailApp.sendEmail({
      to: to,
      subject: "Giftory enquiry · " + source + " · " + name,
      body: text,
      htmlBody: html,
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

// One entry per product: a label and a link to its page on the website.
function productItems(data) {
  const site = String(data.siteUrl || "").replace(/\/+$/, "");
  if (data.products && data.products.length) {
    return data.products.map(function (item) {
      return {
        label: item.name + " (" + item.code + ")",
        link: item.slug && site ? site + "/products/" + item.slug : data.pageUrl || "",
      };
    });
  }
  if (data.productName) {
    return [
      {
        label: data.productName + (data.productCode ? " (" + data.productCode + ")" : ""),
        link: data.pageUrl || "",
      },
    ];
  }
  return [];
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#39;");
}

function jsonOutput(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
