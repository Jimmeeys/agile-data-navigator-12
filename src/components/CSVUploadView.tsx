
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CirclePlus, FileSpreadsheet, HelpCircle, Trash2, Upload, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

export function CSVUploadView() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [exclusionRules, setExclusionRules] = useState<{column: string, value: string}[]>([]);
  const [processingOptions, setProcessingOptions] = useState({
    skipFirstRow: true,
    trimWhitespace: true,
    removeEmptyRows: true,
    processingMethod: 'append',
    dateFormat: 'MM/DD/YYYY'
  });
  const [progress, setProgress] = useState<number | null>(null);
  const [step, setStep] = useState<'upload' | 'mapping' | 'exclusions' | 'processing'>('upload');

  const leadColumns = [
    { value: 'fullName', label: 'Full Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'source', label: 'Source' },
    { value: 'status', label: 'Status' },
    { value: 'stage', label: 'Stage' },
    { value: 'associate', label: 'Associate' },
    { value: 'createdAt', label: 'Created At' },
    { value: 'lastContact', label: 'Last Contact' },
    { value: 'remarks', label: 'Remarks' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target?.result as string;
        const lines = csv.split('\n');
        const data = lines.map(line => line.split(',').map(cell => cell.trim()));
        
        if (data.length > 0) {
          const csvHeaders = data[0];
          setHeaders(csvHeaders);
          setPreviewData(data.slice(1, 6)); // Preview first 5 rows
          
          // Create initial mappings
          const initialMappings: Record<string, string> = {};
          csvHeaders.forEach(header => {
            // Try to find matching column
            const matchingColumn = leadColumns.find(col => 
              col.label.toLowerCase() === header.toLowerCase() || 
              col.value.toLowerCase() === header.toLowerCase()
            );
            initialMappings[header] = matchingColumn?.value || '';
          });
          setMappings(initialMappings);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setPreviewData([]);
      setHeaders([]);
      setMappings({});
    }
  };

  const handleAddExclusionRule = () => {
    setExclusionRules([...exclusionRules, { column: '', value: '' }]);
  };

  const handleRemoveExclusionRule = (index: number) => {
    setExclusionRules(exclusionRules.filter((_, i) => i !== index));
  };

  const updateExclusionRule = (index: number, field: 'column' | 'value', value: string) => {
    const updatedRules = [...exclusionRules];
    updatedRules[index][field] = value;
    setExclusionRules(updatedRules);
  };

  const handleUpload = () => {
    // Simulate upload process
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          toast({
            title: "Upload Successful",
            description: "Your CSV data has been processed successfully.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleNextStep = () => {
    if (step === 'upload' && !file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a CSV file to upload.",
      });
      return;
    }
    
    if (step === 'upload') setStep('mapping');
    else if (step === 'mapping') setStep('exclusions');
    else if (step === 'exclusions') setStep('processing');
    else if (step === 'processing') handleUpload();
  };

  const handlePrevStep = () => {
    if (step === 'mapping') setStep('upload');
    else if (step === 'exclusions') setStep('mapping');
    else if (step === 'processing') setStep('exclusions');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 text-sm">
        <span className={step === 'upload' ? 'font-medium text-primary' : 'text-muted-foreground'}>
          Upload File
        </span>
        <span className="mx-2 text-muted-foreground">→</span>
        <span className={step === 'mapping' ? 'font-medium text-primary' : 'text-muted-foreground'}>
          Column Mapping
        </span>
        <span className="mx-2 text-muted-foreground">→</span>
        <span className={step === 'exclusions' ? 'font-medium text-primary' : 'text-muted-foreground'}>
          Exclusion Rules
        </span>
        <span className="mx-2 text-muted-foreground">→</span>
        <span className={step === 'processing' ? 'font-medium text-primary' : 'text-muted-foreground'}>
          Processing Options
        </span>
      </div>

      {step === 'upload' && (
        <Card className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/90 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-3">
                <h3 className="font-medium">Drag and drop your CSV file here</h3>
                <p className="text-sm text-muted-foreground">or</p>
                <div>
                  <Label 
                    htmlFor="csv-upload" 
                    className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Label>
                  <Input 
                    id="csv-upload"
                    type="file" 
                    accept=".csv" 
                    onChange={handleFileChange} 
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            
            {file && (
              <div className="bg-primary/10 rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <FileSpreadsheet className="w-6 h-6 mr-2 text-primary" />
                  <span>{file.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setFile(null)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {previewData.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="text-sm font-medium p-3 bg-muted/50">
                  Preview (first 5 rows)
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {headers.map((header, index) => (
                          <TableHead key={index}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled={!file} onClick={handleNextStep}>
              Next: Column Mapping
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'mapping' && (
        <Card className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/90 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Column Mapping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border-blue-200 dark:border-blue-800/30">
              <HelpCircle className="h-4 w-4" />
              <AlertTitle>Map CSV columns to lead fields</AlertTitle>
              <AlertDescription>
                Match each column from your CSV file to the corresponding field in the leads database.
                Unmapped columns will be ignored during import.
              </AlertDescription>
            </Alert>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">CSV Column</TableHead>
                    <TableHead className="w-1/3">Maps To</TableHead>
                    <TableHead className="w-1/3">Preview</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {headers.map((header, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{header}</TableCell>
                      <TableCell>
                        <Select
                          value={mappings[header] || ''}
                          onValueChange={(value) => setMappings({...mappings, [header]: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Ignore this column --</SelectItem>
                            {leadColumns.map(col => (
                              <SelectItem key={col.value} value={col.value}>{col.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {previewData.length > 0 ? previewData[0][index] : ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
            <Button onClick={handleNextStep}>
              Next: Exclusion Rules
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'exclusions' && (
        <Card className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/90 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Exclusion Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-800/30">
              <HelpCircle className="h-4 w-4" />
              <AlertTitle>Define exclusion criteria</AlertTitle>
              <AlertDescription>
                Specify which rows should be excluded from import. If a row contains the specified value in the selected column,
                it will be skipped during import.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              {exclusionRules.map((rule, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="grid gap-2 flex-1">
                    <Label>Column</Label>
                    <Select
                      value={rule.column}
                      onValueChange={(value) => updateExclusionRule(index, 'column', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        {headers.map((header, i) => (
                          <SelectItem key={i} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 flex-1">
                    <Label>Value to exclude</Label>
                    <Input
                      value={rule.value}
                      onChange={(e) => updateExclusionRule(index, 'value', e.target.value)}
                      placeholder="Value to exclude"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-8"
                    onClick={() => handleRemoveExclusionRule(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button variant="secondary" className="gap-2" onClick={handleAddExclusionRule}>
                <CirclePlus className="h-4 w-4" />
                Add Exclusion Rule
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
            <Button onClick={handleNextStep}>
              Next: Processing Options
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 'processing' && (
        <Card className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/90 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Processing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Skip header row</Label>
                  <p className="text-sm text-muted-foreground">Don't import the first row (column headers)</p>
                </div>
                <Switch
                  checked={processingOptions.skipFirstRow}
                  onCheckedChange={(checked) => 
                    setProcessingOptions({...processingOptions, skipFirstRow: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Trim whitespace</Label>
                  <p className="text-sm text-muted-foreground">Remove extra spaces from beginning and end of fields</p>
                </div>
                <Switch
                  checked={processingOptions.trimWhitespace}
                  onCheckedChange={(checked) => 
                    setProcessingOptions({...processingOptions, trimWhitespace: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Remove empty rows</Label>
                  <p className="text-sm text-muted-foreground">Skip rows where all fields are empty</p>
                </div>
                <Switch
                  checked={processingOptions.removeEmptyRows}
                  onCheckedChange={(checked) => 
                    setProcessingOptions({...processingOptions, removeEmptyRows: checked})
                  }
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Date format</Label>
                <RadioGroup
                  value={processingOptions.dateFormat}
                  onValueChange={(value) => 
                    setProcessingOptions({...processingOptions, dateFormat: value})
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MM/DD/YYYY" id="date-1" />
                    <Label htmlFor="date-1">MM/DD/YYYY</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DD/MM/YYYY" id="date-2" />
                    <Label htmlFor="date-2">DD/MM/YYYY</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="YYYY-MM-DD" id="date-3" />
                    <Label htmlFor="date-3">YYYY-MM-DD</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Processing method</Label>
                <Select
                  value={processingOptions.processingMethod}
                  onValueChange={(value) => 
                    setProcessingOptions({...processingOptions, processingMethod: value as any})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="append">Append - Add all new records</SelectItem>
                    <SelectItem value="update">Update - Update existing records and add new ones</SelectItem>
                    <SelectItem value="replace">Replace - Delete existing data and import new data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {progress !== null && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={progress !== null}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {progress === null ? (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Start Import
                </>
              ) : progress === 100 ? (
                "Import Complete"
              ) : (
                "Importing..."
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default CSVUploadView;
