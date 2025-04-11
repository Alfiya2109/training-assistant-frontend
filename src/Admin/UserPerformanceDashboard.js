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
  useTheme
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const UserPerformanceDashboard = () => {
  const [data, setData] = useState([]); // API Data
  const [rows, setRows] = useState([]); // Processed rows
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const API_ENDPOINT = `${API_BASE_URL}/user-performance/`;
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        console.log("Fetched API Data:", result);
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
      console.log("Processing Data:", data);

      const processedRows = data.flatMap((student) => {
        let lastActive = new Date(0);
        if (student.activity_log?.length) {
          lastActive = new Date(student.activity_log[0].date);
        }

        const difficultyCount = {};

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

          return Object.entries(difficultyCount).map(([lang, counts]) => ({
            username: student.username,
            firstname: student.firstname,
            lastname: student.lastname,
            totalProblemsSolved: student.total_problems_solved || 0,
            language: lang,
            easy: counts.easy,
            medium: counts.medium,
            hard: counts.hard,
            languageTotal: counts.total,
            lastActive,
          }));
        } else {
          return [{
            username: student.username,
            firstname: student.firstname,
            lastname: student.lastname,
            totalProblemsSolved: student.total_problems_solved || 0,
            language: "N/A",
            easy: 0,
            medium: 0,
            hard: 0,
            languageTotal: 0,
            lastActive,
          }];
        }
      });

      setRows(processedRows);
      console.log("Processed Rows:", processedRows);
    }
  }, [data, loading]);

  const filteredRows = rows.filter((row) => {
    const term = searchTerm.toLowerCase();
    return (
      // row.username.toLowerCase().includes(term) ||
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
        <Box display="flex" justifyContent="center" gap={2} my={2} flexWrap="wrap">
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
              {dateFilteredRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.firstname} {row.lastname}</TableCell>
                  <TableCell align="right">{row.totalProblemsSolved}</TableCell>
                  <TableCell>{row.language}</TableCell>
                  <TableCell align="right">{row.easy}</TableCell>
                  <TableCell align="right">{row.medium}</TableCell>
                  <TableCell align="right">{row.hard}</TableCell>
                  {!isMobile && <TableCell align="right">{row.languageTotal}</TableCell>}
                  <TableCell align="right">
                    {format(row.lastActive, 'dd-MM-yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default UserPerformanceDashboard;
