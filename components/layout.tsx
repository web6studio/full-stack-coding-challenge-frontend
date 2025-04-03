const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="max-w-3xl px-5 py-5 mx-auto md:px-0 md:py-10">{children}</div>
}

export default Layout
