// Next.js 15 types for app router
export interface PageProps {
  params: Promise<any>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface LayoutProps {
  children: React.ReactNode
  params: Promise<any>
}