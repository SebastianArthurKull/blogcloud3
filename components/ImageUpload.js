import {useRef, useState} from "react"

const toBase64 = file => new Promise((resolve, reject ) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
})

export default function ImageUpload({uploadData}) {
    const [base64Image, setBase64Image] = useState("")
    const fileInput = useRef(null)

    const onFileInputChange = async () => {
        const file = fileInput.current.files[0]
        if (!file) return
        const base64 = await toBase64(file)
        uploadData(base64)
        setBase64Image(base64Image)
    }

    return (<section>
        <form>
            <input
                type="file"
                accept=".png,.jpg"
                ref={fileInput}
                onChange={onFileInputChange}
            />
        </form>

    </section>)
}