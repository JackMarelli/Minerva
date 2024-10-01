export default function BaseLayout({children}) {
    return(<div className="w-full h-fit min-h-screen grid grid-cols-12 gap-6 px-64 py-8">{children}</div>)
}