export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full flex flex-col">{children}</div>;
}
