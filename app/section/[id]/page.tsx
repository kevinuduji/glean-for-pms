import { redirect } from "next/navigation";

export default function SectionRoot({ params }: { params: { id: string } }) {
  redirect(`/section/${params.id}/overview`);
}
