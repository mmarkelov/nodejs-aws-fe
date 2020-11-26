import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

export default function CSVFileImport({url, title}: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();

  const onFileChange = (e: any) => {
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
      setFile(files[0])
  };

  const removeFile = () => {
    setFile(null);
  };

  const uploadFile = async () => {
      const authToken = localStorage.getItem('authorization_token');
      // Get the presigned URL
      const response = await axios({
        method: 'GET',
        url: `${url}?name=${encodeURIComponent(file.name)}`,
        headers: {
           Authorization: `Basic ${authToken}`
        }
      })
      const signedUrl = response.data
      console.log('Response: ', signedUrl)
      console.log('Uploading: ', file)

      const result = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {'Content-Type': 'text/csv'}
      })
      console.log('Result: ', result)
      setFile(null);
    }
  ;

  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
          <input type="file" onChange={onFileChange}/>
      ) : (
        <div>
          <Button onClick={removeFile} color="secondary">Remove file</Button>
          <Button onClick={uploadFile} color="primary">Upload file</Button>
        </div>
      )}
    </div>
  );
}
