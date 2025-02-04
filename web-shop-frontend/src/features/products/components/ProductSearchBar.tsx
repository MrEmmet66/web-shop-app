import { Form, Input } from "antd"
import { ChangeEvent, KeyboardEvent, RefAttributes, useRef, useState } from "react"

function ProductSearchBar({ onSearch }: { onSearch: (search: string) => void }) {
  const [search, setSearch] = useState('')
  const ref = useRef(null);

  const handleSearchSubmit = (event: SubmitEvent) => {
    onSearch(search)
  }

  const onFormPressEnter = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      ref.current.submit();
    }

  }

  return (
    <Form layout="inline" ref={ref} onFinish={handleSearchSubmit} onKeyDown={onFormPressEnter}>
      <Form.Item label="Search">
        <Input placeholder="Search products" onChange={(e) => setSearch(e.target.value)} />
      </Form.Item>
    </Form>
  )
}
export default ProductSearchBar