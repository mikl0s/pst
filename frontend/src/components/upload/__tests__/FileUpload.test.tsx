import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from '../FileUpload';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FileUpload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload area', () => {
    render(<FileUpload />);
    expect(screen.getByText(/Drag and drop a PST file here, or click to select/i)).toBeInTheDocument();
    expect(screen.getByText(/Only PST files are accepted/i)).toBeInTheDocument();
  });

  it('handles valid PST file upload', async () => {
    const file = new File(['dummy content'], 'test.pst', { type: 'application/vnd.ms-outlook' });
    mockedAxios.post.mockResolvedValueOnce({ data: { message: 'Success' } });
    
    render(<FileUpload />);
    
    const dropzone = screen.getByText(/Drag and drop a PST file here/i);
    
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
        types: ['Files']
      }
    });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/upload/',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: expect.any(Function),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('File uploaded successfully!')).toBeInTheDocument();
    });
  });

  it('rejects non-PST files', async () => {
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    
    render(<FileUpload />);
    
    const dropzone = screen.getByText(/Drag and drop a PST file here/i);
    
    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
          types: ['Files']
        }
      });
    });

    expect(screen.getByText('Only PST files are accepted')).toBeInTheDocument();
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('handles upload error', async () => {
    const file = new File(['dummy content'], 'test.pst', { type: 'application/vnd.ms-outlook' });
    const errorMessage = 'Network error';
    mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<FileUpload />);
    
    const dropzone = screen.getByText(/Drag and drop a PST file here/i);
    
    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
          types: ['Files']
        }
      });
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows upload progress', async () => {
    const file = new File(['dummy content'], 'test.pst', { type: 'application/vnd.ms-outlook' });
    mockedAxios.post.mockImplementation((url, data, config) => {
      if (config?.onUploadProgress) {
        config.onUploadProgress({ loaded: 50, total: 100 });
      }
      return Promise.resolve({ data: { message: 'Success' } });
    });
    
    render(<FileUpload />);
    
    const dropzone = screen.getByText(/Drag and drop a PST file here/i);
    
    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
          types: ['Files']
        }
      });
    });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalled();
    });
  });
});
