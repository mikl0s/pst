import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import FileUpload from '../FileUpload';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FileUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload area', () => {
    render(<FileUpload />);
    expect(screen.getByText(/Drag and drop a PST file here/i)).toBeInTheDocument();
  });

  it('handles valid PST file upload', async () => {
    const file = new File(['dummy content'], 'test.pst', { type: 'application/octet-stream' });
    mockedAxios.post.mockResolvedValueOnce({ data: { status: 'success' } });

    render(<FileUpload />);
    
    const uploadArea = screen.getByText(/Drag and drop a PST file here/i);
    fireEvent.drop(uploadArea, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/upload/',
        expect.any(FormData),
        expect.any(Object)
      );
    });

    expect(screen.getByText(/File uploaded successfully/i)).toBeInTheDocument();
  });

  it('rejects non-PST files', async () => {
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });

    render(<FileUpload />);
    
    const uploadArea = screen.getByText(/Drag and drop a PST file here/i);
    fireEvent.drop(uploadArea, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByText(/Only PST files are allowed/i)).toBeInTheDocument();
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('handles upload error', async () => {
    const file = new File(['dummy content'], 'test.pst', { type: 'application/octet-stream' });
    mockedAxios.post.mockRejectedValueOnce(new Error('Upload failed'));

    render(<FileUpload />);
    
    const uploadArea = screen.getByText(/Drag and drop a PST file here/i);
    fireEvent.drop(uploadArea, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/Error uploading file/i)).toBeInTheDocument();
    });
  });

  it('shows upload progress', async () => {
    const file = new File(['dummy content'], 'test.pst', { type: 'application/octet-stream' });
    
    // Mock successful upload with progress
    mockedAxios.post.mockImplementationOnce((url, data, config) => {
      if (config.onUploadProgress) {
        config.onUploadProgress({ loaded: 50, total: 100 });
      }
      return Promise.resolve({ data: { status: 'success' } });
    });

    render(<FileUpload />);
    
    const uploadArea = screen.getByText(/Drag and drop a PST file here/i);
    fireEvent.drop(uploadArea, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});
