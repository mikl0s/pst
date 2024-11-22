import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, LinearProgress, Paper, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  borderStyle: 'dashed',
  borderWidth: 2,
  backgroundColor: theme.palette.grey[50],
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const FileUpload: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pst')) {
      setError('Only PST files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setError(null);
      setSuccess(null);
      
      const response = await axios.post('http://localhost:8000/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      setSuccess('File uploaded successfully!');
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-outlook': ['.pst']
    },
    multiple: false,
  });

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <UploadBox {...getRootProps()}>
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? 'Drop the PST file here'
            : 'Drag and drop a PST file here, or click to select'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Only PST files are accepted
        </Typography>
      </UploadBox>
      {uploadProgress > 0 && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
            {uploadProgress}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
