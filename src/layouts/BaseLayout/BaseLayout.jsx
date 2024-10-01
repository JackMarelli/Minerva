export default function BaseLayout({children}) {
    return(<div className="w-full h-fit min-h-screen grid grid-cols-12 gap-6 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-24 py-4 md:py-8">{children}</div>)
}