import {date, z} from "zod";

export const createApplicationSchema = z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    status: z.enum(["Applied", "Interview", "Offer", "Rejected"]),
    dateApplied: z.string(),
    notes: z.string().max(1000).optional()
});

export const updateApplicationSchema= z.object({
    company:z.string().min(1).optional(),
    role:z.string().min(1).optional(),
    status:z.enum(["Applied","Interview","Offer","Rejected"]).optional(),
    dateApplied:z.string().optional(),
    notes:z.string().max(1000).optional()
});

