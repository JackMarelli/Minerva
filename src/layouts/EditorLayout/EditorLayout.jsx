export default function EditorLayout({ children, title }) {
  return (
    <div className="w-full h-fit max-w-[760px] grid grid-cols-12 mx-auto my-16 gap-12">
      <h1 className="col-span-full h-fit text-4xl font-bold font-mono">
        {title}
      </h1>
      <hr className="col-span-full bg-slate-300" />
      {children}
    </div>
  );
}
