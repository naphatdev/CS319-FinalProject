interface FilterState {
    categoryId: number | null;
    status: ReportStatus | null;
    setCategory: (id: number | null) => void;
    setStatus: (status: ReportStatus | null) => void;
    reset: () => void;
}
// ชื่อ hook ต้องเป็น useFilterStore