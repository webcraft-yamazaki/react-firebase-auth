import React, { useEffect, memo } from 'react'
import { useDropzone } from 'react-dropzone';
const MyDropzone = memo((props) => {
  const { onDrop } = props;
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  useEffect(() => {
    if (acceptedFiles.length) {
      onDrop && onDrop(acceptedFiles);
    }
  }, [acceptedFiles]);

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
})

export default MyDropzone