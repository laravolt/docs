export function IFrame(props: React.ComponentProps<'iframe'>) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <iframe {...props} />
    </div>
  )
}
