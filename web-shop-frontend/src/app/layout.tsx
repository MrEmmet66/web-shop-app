import CustomLayout from "@/commonComponents/CustomLayout"
import ReduxProvider from "@/redux/ReduxProvider"

function RootLayout({ children }: React.PropsWithChildren) {

  return (
    <ReduxProvider>
      <html>
        <body>
          <CustomLayout>
            {children}
          </CustomLayout>
        </body>
      </html>
    </ReduxProvider>
  )
}
export default RootLayout