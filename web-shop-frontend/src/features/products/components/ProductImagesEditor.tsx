import { PlusOutlined } from "@ant-design/icons";
import { Upload, UploadFile } from "antd";

interface ProductImagesEditorProps {
    images: UploadFile[];
    onImagesChange: (images: UploadFile[]) => void;

}

function ProductImagesEditor({ images, onImagesChange }: ProductImagesEditorProps) {
    const handleImagesChange = ({ fileList }: { fileList: UploadFile[] }) => {
        onImagesChange(fileList);
    }

    return (
        <Upload
            listType="picture-card"
            fileList={images}
            onChange={handleImagesChange}
            beforeUpload={() => false}
            multiple
            maxCount={10}
            >
            {images.length < 10 && <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>}
        </Upload>
    )
}
export default ProductImagesEditor