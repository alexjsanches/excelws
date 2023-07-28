// Arquivo page.tsx (ou App.tsx)
'use client'
import React, { useState, ChangeEvent, useEffect } from 'react';
import { read, utils, CellObject } from 'xlsx';
import Apps from './App'
import WordModal from './WordSelector';
import './App.css';

export default function App() {
  const [excelData, setExcelData] = useState<any[][]>([]);
  const [columnTypes, setColumnTypes] = useState<string[]>([]);
  const [selectedPhrases, setSelectedPhrases] = useState<string[][]>([]);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);


  useEffect(() => {
    // ...

    // Verifica se excelData possui dados antes de criar selectedPhrases
    if (excelData.length > 1) {
      setSelectedPhrases(new Array(excelData.length - 1).fill('').map(() => new Array(excelData[0].length).fill('')));
    }
  }, [excelData]);
  
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = event.target?.result;
        if (data instanceof ArrayBuffer) {
          const workbook = read(new Uint8Array(data), { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelData = utils.sheet_to_json(worksheet, { header: 1, defval: '<vazio>' }) as any[][];

          // Assuming you want to preview the first 10 rows (header + 9 data rows)
          const previewData = excelData.slice(0, 10);

          // Initialize the columnTypes state with default value "text" for all columns
          const defaultColumnType = "text";
          const columnTypes = new Array(previewData[0].length).fill(defaultColumnType);
          setColumnTypes(columnTypes);

          setExcelData(excelData);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleColumnTypeChange = (e: ChangeEvent<HTMLSelectElement>, columnIndex: number) => {
    const newColumnTypes = [...columnTypes];
    newColumnTypes[columnIndex] = e.target.value;
    setColumnTypes(newColumnTypes);
  };
  const handleSelectColumnBase = (columnIndex: number) => {
    setSelectedColumn(columnIndex);
    setIsModalOpen(false); // Close the modal when changing column base
  };
  
  const handleSelectButtonClick = (rowIndex: number) => {
    setCurrentRowIndex(rowIndex);
    setIsModalOpen(true); // Abrir o modal ao clicar no botão "+"
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Fechar o modal ao salvar ou cancelar
  };

  const handleModalSave = (selectedWords: string[]) => {
    if (currentRowIndex !== null && selectedColumn !== null) {
      const updatedSelectedPhrases = [...selectedPhrases];
      updatedSelectedPhrases[currentRowIndex][selectedColumn] = selectedWords.join(' ');
      setSelectedPhrases(updatedSelectedPhrases);
      setIsModalOpen(false); // Fechar o modal após salvar as palavras selecionadas
    }
  };
  

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls, .csv, .xml" />
      <table>
  <thead>
    <tr>
      {excelData[0] &&
        excelData[0].map((header, index) => (
          <th key={index} style={{ border: '1px solid black', padding: '8px' }}>
  {header}
  <br />
  <select value={columnTypes[index]} onChange={(e) => handleColumnTypeChange(e, index)}>
    <option value="text">Texto</option>
    <option value="date">Data</option>
    <option value="percent">Percentual</option>
    {/* Adicione outras opções de tipo de dado aqui */}
  </select>
  <br />
  <button
    className={`select-base-button ${selectedColumn === index ? 'redButton' : ''}`}
    onClick={() => handleSelectColumnBase(index)}
  >
    Selecionar Coluna Base
  </button>
</th>
        ))}
    </tr>
  </thead>
  <tbody>
  {excelData.slice(1).map((row, rowIndex) => (
    <tr key={rowIndex}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>
          {/* Verifica se a célula está vazia e exibe o texto "<vazio>" */}
          {cell === '<vazio>'
            ? ''
            : columnTypes[cellIndex] === 'date'
            ? new Date(cell).toLocaleDateString()
            : cell}
        </td>
      ))}
      <td className="cell-with-button">
        <button
          className="floating-button"
          onClick={() => handleSelectButtonClick(rowIndex + 1)} // Adiciona 1 ao rowIndex para abrir a linha 2
        >
          +
        </button>
        {selectedColumn !== null ? selectedPhrases[rowIndex][selectedColumn] || '' : ''}
      </td>
    </tr>
  ))}
</tbody>







</table>
{currentRowIndex !== null && selectedColumn !== null && (
        <WordModal
          phrase={selectedColumn === null ? '' : excelData[currentRowIndex][selectedColumn] || ''}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
        )}
    </div>
  );
}

