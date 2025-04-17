import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
  TextField,
  Box,
  Paper,
  TableContainer,
  useMediaQuery,
  useTheme,
  Button
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';

const UserPerformanceDashboard = () => {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const API_ENDPOINT = `${API_BASE_URL}/user-performance/`;
  const token = localStorage.getItem('access_token');

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        setData(result || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_ENDPOINT, token]);

  useEffect(() => {
    if (!loading && data.length > 0) {
      const processedRows = data.flatMap((student) => {
        let lastActive = new Date(0);
        if (student.activity_log?.length) {
          lastActive = new Date(student.activity_log[0].date);
        }

        const difficultyCount = {};
        let totalSolved = 0;

        if (student.question_status?.length) {
          student.question_status.forEach((qs) => {
            const lang = qs.language || "N/A";
            const difficulty = qs.difficulty || "N/A";

            if (!difficultyCount[lang]) {
              difficultyCount[lang] = { easy: 0, medium: 0, hard: 0, total: 0 };
            }

            if (difficulty === "easy") difficultyCount[lang].easy += 1;
            else if (difficulty === "medium") difficultyCount[lang].medium += 1;
            else if (difficulty === "hard") difficultyCount[lang].hard += 1;

            difficultyCount[lang].total += 1;
          });

          // Calculate total problems solved for this user
          totalSolved = Object.values(difficultyCount).reduce((acc, counts) => acc + counts.total, 0);

          return Object.entries(difficultyCount).map(([lang, counts], index) => ({
            username: student.username,
            firstname: student.firstname,
            lastname: student.lastname,
            totalProblemsSolved: totalSolved, // use the calculated total
            language: capitalizeFirstLetter(lang),
            easy: counts.easy,
            medium: counts.medium,
            hard: counts.hard,
            languageTotal: counts.total,
            lastActive,
            rowIndex: index,
            rowSpan: Object.keys(difficultyCount).length
          }));
        } else {
          return [{
            username: student.username,
            firstname: student.firstname,
            lastname: student.lastname,
            totalProblemsSolved: 0,
            language: "N/A",
            easy: 0,
            medium: 0,
            hard: 0,
            languageTotal: 0,
            lastActive,
            rowIndex: 0,
            rowSpan: 1
          }];
        }
      });

      setRows(processedRows);
    }
  }, [data, loading]);

  const filteredRows = rows.filter((row) => {
    const term = searchTerm.toLowerCase();
    return (
      row.firstname.toLowerCase().includes(term) ||
      row.language.toLowerCase().includes(term)
    );
  });

  const dateFilteredRows = filteredRows.filter((row) => {
    if (!startDate && !endDate) return true;
    const lastActive = row.lastActive;
    return (
      (!startDate || lastActive >= startDate) &&
      (!endDate || lastActive <= endDate)
    );
  });

  const exportToExcel = () => {
    const exportData = dateFilteredRows.map(row => ({
      Username: row.username,
      Firstname: row.firstname,
      Lastname: row.lastname,
      Total_Problems_Solved: row.totalProblemsSolved,
      Language: row.language,
      Easy: row.easy,
      Medium: row.medium,
      Hard: row.hard,
      Language_Total: row.languageTotal,
      Last_Active: format(row.lastActive, 'dd-MM-yyyy')
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Performance");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "user_performance.xlsx");
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4, px: isMobile ? 2 : 4 }}>
      <Typography variant={isMobile ? 'h6' : 'h5'} align="center" gutterBottom>
        Student Progress Dashboard
      </Typography>

      <TextField
        label="Search (by name or language)"
        variant="outlined"
        fullWidth
        margin="normal"
        size={isMobile ? 'small' : 'medium'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box display="flex" justifyContent="right" gap={2} my={2} flexWrap="wrap" alignItems="center">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            format="dd-MM-yyyy"
            slotProps={{ textField: { variant: 'outlined' } }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            format="dd-MM-yyyy"
            slotProps={{ textField: { variant: 'outlined' } }}
          />
          <Button
            variant="contained"
            onClick={exportToExcel}
            size="small"
            sx={{
              minWidth: 'auto',
              px: 2,
              py: 1,
              mt: isMobile ? 1 : 0,
              backgroundColor: 'oklch(37.9% 0.146 265.522)',
              '&:hover': {
                backgroundColor: 'oklch(37.9% 0.146 265.522)',
              },
            }}
          >
            <DownloadIcon fontSize="large" />
          </Button>
        </Box>
      </LocalizationProvider>

      {loading ? (
        <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Box>
      ) : dateFilteredRows.length === 0 ? (
        <Typography variant="body1" align="center">
          No data available.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Total Solved</TableCell>
                <TableCell>Language</TableCell>
                <TableCell align="right">Easy</TableCell>
                <TableCell align="right">Medium</TableCell>
                <TableCell align="right">Hard</TableCell>
                {!isMobile && <TableCell align="right">Total</TableCell>}
                <TableCell align="right">Last Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                const groupedByUser = {};

                // Sort rows by lastActive DESCENDING before grouping
                const sortedRows = [...dateFilteredRows].sort((a, b) => b.lastActive - a.lastActive);

                sortedRows.forEach((row) => {
                  const key = row.username;
                  if (!groupedByUser[key]) groupedByUser[key] = [];
                  groupedByUser[key].push(row);
                });

                return Object.entries(groupedByUser).flatMap(([username, userRows]) => {
                  return userRows.map((row, idx) => (
                    <TableRow key={`${username}-${idx}`}>
                      {idx === 0 && (
                        <>
                          <TableCell rowSpan={userRows.length}>
                            {row.firstname} {row.lastname}
                          </TableCell>
                          <TableCell rowSpan={userRows.length} align="right">
                            {row.totalProblemsSolved}
                          </TableCell>
                        </>
                      )}
                      <TableCell>{row.language}</TableCell>
                      <TableCell align="right">{row.easy}</TableCell>
                      <TableCell align="right">{row.medium}</TableCell>
                      <TableCell align="right">{row.hard}</TableCell>
                      {!isMobile && (
                        <TableCell align="right">{row.languageTotal}</TableCell>
                      )}
                      <TableCell align="right">
                        {format(row.lastActive, 'dd-MM-yyyy')}
                      </TableCell>
                    </TableRow>
                  ));
                });
              })()}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default UserPerformanceDashboard;
