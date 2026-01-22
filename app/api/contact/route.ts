import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address"),
  projectType: z.enum(["new", "existing"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `🚀 Portfolio Lead: ${validatedData.name} (${validatedData.projectType})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>New Project Inquiry</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Company:</strong> ${validatedData.company || "N/A"}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Project Type:</strong> ${validatedData.projectType === 'new' ? 'New Project' : 'Modification of Existing'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #4f46e5;">
            ${validatedData.message}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 400 });
  }
}