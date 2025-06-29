import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { UploadCloud, FileText, CalendarClock } from 'lucide-react';

const API_URL = 'https://ea00-45-64-237-226.ngrok-free.app/upload-prescription';

const Upload = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patient_name: '',
    contact_number: '',
    wake_up_time: '',
    breakfast_time: '',
    lunch_time: '',
    dinner_time: '',
    sleep_time: ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Please upload a valid PDF, JPG, or PNG file.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedFile) return alert('Please select a file to upload.');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_schedule_json', JSON.stringify(form));

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Upload failed');

      // Success
      alert('Upload successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center my-20 px-4">
      <Card className="w-full max-w-xl p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Set-up Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            ['patient_name', 'Patient Name', 'text'],
            ['contact_number', 'Contact Number', 'text'],
            ['wake_up_time', 'Wake-up Time', 'time'],
            ['breakfast_time', 'Breakfast Time', 'time'],
            ['lunch_time', 'Lunch Time', 'time'],
            ['dinner_time', 'Dinner Time', 'time'],
            ['sleep_time', 'Sleep Time', 'time']
          ].map(([name, label, type]) => (
            <div key={name} className="space-y-1">
              <Label htmlFor={name}>{label}</Label>
              <Input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleInputChange}
              />
            </div>
          ))}

          <div className="space-y-1">
            <Label htmlFor="file-upload">Upload PDF or Image</Label>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="outline" onClick={handleUploadClick}>
              Choose File
            </Button>
            {selectedFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {selectedFile.name}
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Submit Prescription'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
