export function IFrame(props: React.ComponentProps<'iframe'>) {
  return (
    <div className="w-full">
      <iframe {...props} />
    </div>
  )
}
