'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { mockStudies } from '@/lib/mock-data/studies';
import { mockIRTRecordsAurora, mockIRTRecordsResolve } from '@/lib/mock-data/irt-records';
import type { IRTRecord, IRTColumnMapping } from '@/lib/types/reconciliation';

type UploadStep = 'idle' | 'analyzing' | 'mapping' | 'ready';

interface IRTUploadProps {
  selectedStudyId: string | null;
  onStudySelect: (studyId: string) => void;
  onImport: (records: IRTRecord[], fileName: string) => void;
}

// Standard IRT column mappings
const standardMappings: IRTColumnMapping[] = [
  { csvColumn: 'Subject ID', mappedTo: 'subjectId', sample: 'AUR-001-001', isRequired: true },
  { csvColumn: 'Date of Birth', mappedTo: 'dateOfBirth', sample: '1968-03-15', isRequired: true },
  { csvColumn: 'ICF Date', mappedTo: 'icfSignDate', sample: '2024-01-10', isRequired: false },
  { csvColumn: 'Enrollment Date', mappedTo: 'enrollmentDate', sample: '2024-01-15', isRequired: false },
  { csvColumn: 'Screening Date', mappedTo: 'screeningDate', sample: '2024-01-08', isRequired: false },
  { csvColumn: 'Site', mappedTo: 'siteNumber', sample: '001', isRequired: false },
  { csvColumn: 'Initials', mappedTo: 'initials', sample: 'MS', isRequired: false },
  { csvColumn: 'First Name', mappedTo: 'firstName', sample: 'Maria', isRequired: false },
  { csvColumn: 'Last Name', mappedTo: 'lastName', sample: 'Santos', isRequired: false },
];

export function IRTUpload({ selectedStudyId, onStudySelect, onImport }: IRTUploadProps) {
  const { addToast } = useToast();
  const [step, setStep] = useState<UploadStep>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [studyDropdownOpen, setStudyDropdownOpen] = useState(false);

  const selectedStudy = mockStudies.find((s) => s.id === selectedStudyId);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (!selectedStudyId) {
        addToast({
          type: 'error',
          title: 'Study Required',
          message: 'Please select a study before uploading.',
        });
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [selectedStudyId, addToast]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedStudyId) {
      addToast({
        type: 'error',
        title: 'Study Required',
        message: 'Please select a study before uploading.',
      });
      return;
    }

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
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Use mock data based on study
    const mockRecords =
      selectedStudyId === 'study-001'
        ? mockIRTRecordsAurora
        : selectedStudyId === 'study-003'
          ? mockIRTRecordsResolve
          : [];

    setRowCount(mockRecords.length);
    setStep('mapping');

    // Simulate mapping verification
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStep('ready');
  };

  const handleProceed = () => {
    // Use mock data based on study
    const mockRecords =
      selectedStudyId === 'study-001'
        ? mockIRTRecordsAurora
        : selectedStudyId === 'study-003'
          ? mockIRTRecordsResolve
          : [];

    onImport(mockRecords, fileName);
  };

  const handleReset = () => {
    setStep('idle');
    setFileName('');
    setRowCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Study Selector */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Select Study <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setStudyDropdownOpen(!studyDropdownOpen)}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-xl
              glass-card-inset transition-all duration-200
              ${studyDropdownOpen ? 'ring-2 ring-mint/50' : ''}
            `}
          >
            <span className={selectedStudy ? 'text-text-primary' : 'text-text-muted'}>
              {selectedStudy ? selectedStudy.name : 'Choose a study...'}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-text-muted transition-transform ${studyDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {studyDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 glass-dropdown z-50 overflow-hidden"
              >
                {mockStudies
                  .filter((s) => s.status === 'active')
                  .map((study) => (
                    <button
                      key={study.id}
                      type="button"
                      onClick={() => {
                        onStudySelect(study.id);
                        setStudyDropdownOpen(false);
                        handleReset();
                      }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 text-left
                        hover:bg-mint/10 transition-colors
                        ${selectedStudyId === study.id ? 'bg-mint/5' : ''}
                      `}
                    >
                      <div>
                        <p className="font-medium text-text-primary">{study.name}</p>
                        <p className="text-sm text-text-muted">
                          {study.protocolNumber} &bull; {study.sponsor}
                        </p>
                      </div>
                      {selectedStudyId === study.id && (
                        <Check className="w-5 h-5 text-mint" />
                      )}
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {!selectedStudyId && (
          <p className="text-sm text-text-muted mt-2">
            You must select a study to scope the reconciliation
          </p>
        )}
      </div>

      {/* Upload Area */}
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
                ${!selectedStudyId ? 'opacity-50 cursor-not-allowed' : ''}
                ${dragActive && selectedStudyId
                  ? 'border-mint bg-mint/5'
                  : 'border-glass-border hover:border-mint/50'
                }
              `}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                disabled={!selectedStudyId}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-mint/10 mb-4">
                <Upload className="w-8 h-8 text-mint" />
              </div>
              <p className="text-lg font-medium text-text-primary">
                Drop your IRT report here
              </p>
              <p className="text-text-muted mt-1">or click to browse</p>
              <p className="text-xs text-text-muted mt-4">
                Supported format: CSV (.csv)
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
            <p className="text-text-muted mt-1">Detecting columns and validating data</p>
          </motion.div>
        )}

        {step === 'mapping' && (
          <motion.div
            key="mapping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8 text-center"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </motion.div>
            <p className="text-lg font-medium text-text-primary">Mapping columns...</p>
            <p className="text-text-muted mt-1">Verifying IRT field mappings</p>
          </motion.div>
        )}

        {step === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* File info */}
            <div className="flex items-center justify-between p-4 rounded-xl glass-card-inset">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">{fileName}</p>
                  <p className="text-sm text-text-muted">
                    {rowCount} records detected &bull; {selectedStudy?.name}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Change File
              </Button>
            </div>

            {/* Column mappings */}
            <div className="glass-card-inset rounded-xl p-4">
              <h3 className="text-sm font-medium text-text-primary mb-3">
                Detected Column Mappings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {standardMappings.slice(0, 6).map((mapping) => (
                  <div
                    key={mapping.csvColumn}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-text-muted">{mapping.csvColumn}</span>
                    <span className="text-text-secondary">&rarr;</span>
                    <span className="text-text-primary font-medium truncate">
                      {mapping.mappedTo}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proceed button */}
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleProceed}>
                Proceed to Review
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
