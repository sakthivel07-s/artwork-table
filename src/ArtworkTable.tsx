import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import axios from 'axios';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const ArtworkTable: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [first, setFirst] = useState<number>(0);
    const [selectedRows, setSelectedRows] = useState<{ [key: number]: Artwork }>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<number>(0);

    const fetchArtworks = async (page: number) => {
        const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
        setArtworks(response.data.data);
        setTotalRecords(response.data.pagination.total);
    };

    useEffect(() => {
        fetchArtworks(currentPage);
    }, [currentPage]);

    const onPageChange = (event: any) => {
        setFirst(event.first);
        setCurrentPage(event.page + 1);
    };

    const handleHeaderClick = () => {
        setShowInput(!showInput);
    };

    const handleSubmit = () => {
        const selectedItems = artworks.slice(0, inputValue);
        const selectedMap: { [key: number]: Artwork } = {};
        selectedItems.forEach(item => {
            selectedMap[item.id] = item;
        });
        setSelectedRows(prev => ({ ...prev, ...selectedMap }));
        setShowInput(false);
    };

    const selectedArray = Object.values(selectedRows);

    const headerTemplate = () => (
        <span
            style={{ cursor: 'pointer', color: 'black' }}
            onClick={handleHeaderClick}
        >
            Title
        </span>
    );

    return (
        <div className="card" style={{ padding: '20px' }}>
            <h2>Artworks Table</h2>

            {showInput && (
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="number"
                        placeholder="Enter value"
                        value={inputValue}
                        onChange={(e) => setInputValue(Number(e.target.value))}
                        style={{ marginRight: '10px' }}
                        min={1}
                        max={artworks.length}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={inputValue < 1 || inputValue > artworks.length}
                    >
                        Submit
                    </button>
                </div>
            )}

            <DataTable
                value={artworks}
                selection={selectedArray}
                onSelectionChange={(e) => {
                    const selected: Artwork[] = e.value;
                    const selectedMap: { [key: number]: Artwork } = {};
                    selected.forEach((item) => {
                        selectedMap[item.id] = item;
                    });
                    setSelectedRows(prev => ({ ...prev, ...selectedMap }));
                }}
                selectionMode="checkbox"
                dataKey="id"
                paginator={false}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
                <Column field="title" header={headerTemplate()} />
                <Column field="place_of_origin" header="Origin" />
                <Column field="artist_display" header="Artist" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Date Start" />
                <Column field="date_end" header="Date End" />
            </DataTable>

            <Paginator
                first={first}
                rows={12}
                totalRecords={totalRecords}
                onPageChange={onPageChange}
            />

            <div style={{ marginTop: '20px' }}>
                <h3>Selected Artworks</h3>
                <ul>
                    {selectedArray.map((item) => (
                        <li key={item.id}>{item.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ArtworkTable;
