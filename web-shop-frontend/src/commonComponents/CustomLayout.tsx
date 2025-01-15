"use client"
import { useGetUserProfileQuery } from "@/features/auth/authEndpoints"
import { useAppSelector } from "@/redux/hooks"
import { Layout } from "antd"
import { Content, Header } from "antd/es/layout/layout"

function CustomLayout({ children }: React.PropsWithChildren) {
  const { data, error, isLoading } = useGetUserProfileQuery()

  return (
    <Layout>
      <Header title="Web-Shop">
        {error ? <div style={{ color: "white" }}>Error</div> : isLoading ? <div style={{ color: "white" }}>Loading</div> : data ? <div style={{ color: "white" }}>Welcome {data.name}</div> : null}
      </Header>
      <Content>{children}</Content>
    </Layout>
  )
}
export default CustomLayout