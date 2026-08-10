import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, description, budget, deliveryDate, image } = body;

    const adminEmail = process.env.ADMIN_EMAIL || "shinchan070804@gmail.com";

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFF7FA; padding: 24px; border-radius: 20px; border: 1px solid #FDE2EC;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #D6336C; margin: 0; font-size: 28px;">its.kirkiri 💖</h1>
          <p style="color: #4A2C33; font-size: 14px; margin-top: 4px;">New Custom Order Request Received!</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #FDE2EC; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
          <h2 style="color: #4A2C33; font-size: 18px; border-bottom: 2px solid #FDE2EC; padding-bottom: 8px; margin-top: 0;">Customer Details</h2>
          
          <table style="width: 100%; text-align: left; font-size: 14px; color: #4A2C33; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #FFF7FA;">
              <td style="padding: 8px 0; font-weight: bold; width: 140px;">Customer Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #FFF7FA;">
              <td style="padding: 8px 0; font-weight: bold;">Phone / WhatsApp:</td>
              <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #D6336C; font-weight: bold; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #FFF7FA;">
              <td style="padding: 8px 0; font-weight: bold;">Email Address:</td>
              <td style="padding: 8px 0;">${email || "Not provided"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #FFF7FA;">
              <td style="padding: 8px 0; font-weight: bold;">Budget Range:</td>
              <td style="padding: 8px 0; color: #D6336C; font-weight: bold;">${budget || "Not specified"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #FFF7FA;">
              <td style="padding: 8px 0; font-weight: bold;">Preferred Date:</td>
              <td style="padding: 8px 0;">${deliveryDate || "Not specified"}</td>
            </tr>
          </table>

          <h2 style="color: #4A2C33; font-size: 16px; border-bottom: 2px solid #FDE2EC; padding-bottom: 8px; margin-top: 20px;">Design Requirements</h2>
          <p style="background-color: #FFF7FA; padding: 12px; border-radius: 12px; font-size: 14px; color: #4A2C33; line-height: 1.6; border: 1px solid #FDE2EC; white-space: pre-wrap;">${description}</p>

          ${
            image
              ? `
            <div style="margin-top: 16px;">
              <p style="font-weight: bold; font-size: 14px; color: #4A2C33;">Reference Image Attached:</p>
              <img src="${image}" alt="Reference Preview" style="max-width: 100%; max-height: 300px; border-radius: 12px; border: 1px solid #FDE2EC;" />
            </div>
            `
              : ""
          }
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #4A2C33; opacity: 0.7;">
          <p>© ${new Date().getFullYear()} its.kirkiri | Automated Order Notification System</p>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: "its.kirkiri Orders <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🌸 New Custom Order Request from ${name} | its.kirkiri`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Resend custom-order error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
