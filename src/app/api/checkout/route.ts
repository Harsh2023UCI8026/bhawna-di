import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, address, city, state, pincode, landmark, paymentMethod, items, totalAmount } = body;

    const adminEmail = process.env.ADMIN_EMAIL || "shinchan070804@gmail.com";

    const itemsTable = items
      .map(
        (item: any) => `
        <tr style="border-bottom: 1px solid #FFF7FA;">
          <td style="padding: 10px 0; font-size: 14px; color: #4A2C33;">
            <strong>${item.product.name}</strong>
            ${item.personalisation ? `<br><small style="color: #D6336C;">Note: ${item.personalisation}</small>` : ""}
          </td>
          <td style="padding: 10px 0; font-size: 14px; text-align: center; color: #4A2C33;">${item.quantity}</td>
          <td style="padding: 10px 0; font-size: 14px; text-align: right; color: #D6336C; font-weight: bold;">₹${item.product.price * item.quantity}</td>
        </tr>
      `
      )
      .join("");

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFF7FA; padding: 24px; border-radius: 20px; border: 1px solid #FDE2EC;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #D6336C; margin: 0; font-size: 28px;">its.kirkiri 🛍️</h1>
          <p style="color: #4A2C33; font-size: 14px; margin-top: 4px;">🎉 New Direct Order Received!</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #FDE2EC; box-shadow: 0 2px 8px rgba(0,0,0,0.03); margin-bottom: 16px;">
          <h2 style="color: #4A2C33; font-size: 16px; border-bottom: 2px solid #FDE2EC; padding-bottom: 8px; margin-top: 0;">Order Summary</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #FDE2EC; text-align: left; font-size: 13px; color: #4A2C33; text-transform: uppercase;">
                <th style="padding: 6px 0;">Product</th>
                <th style="padding: 6px 0; text-align: center;">Qty</th>
                <th style="padding: 6px 0; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTable}
            </tbody>
          </table>

          <div style="border-top: 2px solid #FDE2EC; margin-top: 12px; pt: 12px; text-align: right; font-size: 16px; color: #D6336C; font-weight: bold;">
            Total Amount: ₹${totalAmount}
          </div>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #FDE2EC; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
          <h2 style="color: #4A2C33; font-size: 16px; border-bottom: 2px solid #FDE2EC; padding-bottom: 8px; margin-top: 0;">Delivery & Payment Info</h2>
          
          <p style="margin: 6px 0; font-size: 14px; color: #4A2C33;"><strong>Customer:</strong> ${name}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #4A2C33;"><strong>Phone / WhatsApp:</strong> <a href="tel:${phone}" style="color: #D6336C; font-weight: bold; text-decoration: none;">${phone}</a></p>
          <p style="margin: 6px 0; font-size: 14px; color: #4A2C33;"><strong>Address:</strong> ${address}, ${landmark ? landmark + ", " : ""}${city}, ${state} - ${pincode}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #4A2C33;"><strong>Payment Method:</strong> ${paymentMethod === "COD" ? "Cash on Delivery" : "UPI QR Scan"}</p>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #4A2C33; opacity: 0.7;">
          <p>© ${new Date().getFullYear()} its.kirkiri | Automated Order Notification System</p>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: "its.kirkiri Orders <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🛍️ New Order Placed: ₹${totalAmount} from ${name} | its.kirkiri`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Resend checkout error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
