import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

import './styles.css'

interface Props {
    onFileUploaded: (file: File) => void; //estou falando pro meu componente que recebo uma função como propriedade que ela recebe como parâmetro um File e retorna um void
}


const Dropzone:  React.FC<Props> = ({onFileUploaded}) => {
    
    const [selectedFileUrl, setSelectedFileUrl] = useState('')

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0] // só tnho um arquivo pois então vai esat só na pos 0
        const fileUrl = URL.createObjectURL(file)

        onFileUploaded(file)
        setSelectedFileUrl(fileUrl)
    }, [onFileUploaded])
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*' // só aceito imagens
    })

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />
            {selectedFileUrl 
            ? <img src={selectedFileUrl} alt="Point Thumbnail"/>
            :(
                <p>
                    <FiUpload />
                    Imagem do estabelecimento
                </p>
            )}
        </div>
    )
}
export default Dropzone