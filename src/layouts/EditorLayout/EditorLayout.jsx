export default function BaseLayout({children}) {
    return(<div className="w-full max-w-[760px] h-fit min-h-screen grid grid-cols-12 gap-6 mx-auto my-24">{children}</div>)
}