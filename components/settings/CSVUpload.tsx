'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight,
  Download,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

type UploadStep = 'idle' | 'analyzing' | 'mapping' | 'preview' | 'importing' | 'complete';

interface ColumnMapping {
  csvColumn: string;
  mappedTo: string;
  sample: string;
}

const mockMappings: ColumnMapping[] = [
  { csvColumn: 'First Name', mappedTo: 'firstName', sample: 'John' },
  { csvColumn: 'Last Name', mappedTo: 'lastName', sample: 'Smith' },
  { csvColumn: 'Email Address', mappedTo: 'email', sample: 'john@email.com' },
  { csvColumn: 'Phone Number', mappedTo: 'phone', sample: '(555) 123-4567' },
  { csvColumn: 'Date of Birth', mappedTo: 'dob', sample: '1985-03-15' },
  { csvColumn: 'Study Interest', mappedTo: 'studyId', sample: 'Diabetes Study' },
];

export function CSVUpload() {
  const { addToast } = useToast();
  const [step, setStep] = useState<UploadStep>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [rowCount, setRowCount] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      addToast({
        type: 'error',
        title: 'Invalid File',
        message: 'Please upload a CSV file.',
      });
      return;
    }

    setFileName(file.name);
    setStep('analyzing');

    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRowCount(47);
    setStep('mapping');
  };

  const handleStartImport = async () => {
    setStep('importing');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStep('complete');
    addToast({
      type: 'success',
      title: 'Import Complete',
      message: `Successfully imported ${rowCount} referrals.`,
    });
  };

  const handleReset = () => {
    setStep('idle');
    setFileName('');
    setRowCount(0);
  };

  return (
    <GlassCard padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Import Referrals</h2>
          <p className="text-sm text-text-muted mt-1">
            Upload a CSV file to bulk import referrals
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Download Template
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {step === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-12 text-center transition-all
                ${dragActive
                  ? 'border-mint bg-mint/5'
                  : 'border-glass-border hover:border-mint/50'
                }
              `}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mint/10 mb-4">
                <Upload className="w-8 h-8 text-mint" />
              </div>
              <p className="text-lg font-medium text-text-primary">
                Drop your CSV file here
              </p>
              <p className="text-text-muted mt-1">
                or click to browse
              </p>
              <p className="text-xs text-text-muted mt-4">
                Supported format: .csv (max 10MB)
              </p>
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 text-center"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-vista-blue/10 mb-4"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <FileSpreadsheet className="w-8 h-8 text-vista-blue" />
            </motion.div>
            <p className="text-lg font-medium text-text-primary">
              Analyzing {fileName}...
            </p>
            <p className="text-text-muted mt-1">
              Detecting columns and validating data
            </p>
          </motion.div>
        )}

        {step === 'mapping' && (
          <motion.div
            key="mapping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-mint" />
                <span className="font-medium text-text-primary">{fileName}</span>
                <span className="text-sm text-text-muted">({rowCount} rows)</span>
              </div>
              <button
                onClick={handleReset}
                className="p-1 text-text-muted hover:text-error transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-6">
              <div className="grid grid-cols-3 gap-4 px-4 py-2 text-xs font-medium text-text-muted uppercase">
                <span>CSV Column</span>
                <span>Maps To</span>
                <span>Sample</span>
              </div>
              {mockMappings.map((mapping, index) => (
                <motion.div
                  key={mapping.csvColumn}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-3 gap-4 px-4 py-3 rounded-xl bg-bg-tertiary/50"
                >
                  <span className="text-text-primary">{mapping.csvColumn}</span>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-mint" />
                    <span className="text-mint font-medium">{mapping.mappedTo}</span>
                  </div>
                  <span className="text-text-muted truncate">{mapping.sample}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-glass-border">
              <div className="flex items-center gap-2 text-sm text-mint">
                <CheckCircle className="w-4 h-4" />
                All columns mapped successfully
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleReset}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleStartImport}>
                  Import {rowCount} Referrals
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'importing' && (
          <motion.div
            key="importing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 text-center"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mint/10 mb-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Upload className="w-8 h-8 text-mint" />
              </motion.div>
            </motion.div>
            <p className="text-lg font-medium text-text-primary">
              Importing referrals...
            </p>
            <div className="w-48 h-2 bg-bg-tertiary rounded-full mx-auto mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-mint rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              />
            </div>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 text-center"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mint/10 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <CheckCircle className="w-8 h-8 text-mint" />
            </motion.div>
            <p className="text-lg font-medium text-text-primary">
              Import Complete!
            </p>
            <p className="text-text-muted mt-1">
              Successfully imported {rowCount} referrals
            </p>
            <Button variant="primary" className="mt-6" onClick={handleReset}>
              Import Another File
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
