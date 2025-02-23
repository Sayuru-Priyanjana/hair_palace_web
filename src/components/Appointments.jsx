import React, { useEffect, useRef, useState, useMemo } from 'react';
import '../styles/Appointments.css';
import { database, ref, onValue } from '../firebase'; // Import Firebase functions
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]); // State to store appointments

  // Ref for the current-appointments container
  const appointmentsRef = useRef(null);

  // Helper function to calculate end time
  const calculateEndTime = (startTime, duration) => {
    const startTimeMs = new Date(`1970-01-01T${startTime}:00`).getTime();
    const endTimeMs = startTimeMs + duration * 60000; // Add duration in milliseconds
    return new Date(endTimeMs).toTimeString().slice(0, 5); // Format as HH:mm
  };

  // Fetch appointments from Firebase Realtime Database
  useEffect(() => {
    const appointmentsRef = ref(database, 'appointments'); // Reference to the 'appointments' node
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the data object into an array
        let appointmentsArray = Object.keys(data).map((key) => ({
          id: key, // Include the unique key from Firebase
          ...data[key],
          endTime: calculateEndTime(data[key].time, data[key].duration), // Calculate end time
        }));

        // Sort appointments by start time
        appointmentsArray.sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.time}:00`).getTime();
          const timeB = new Date(`1970-01-01T${b.time}:00`).getTime();
          return timeA - timeB; // Sort in ascending order
        });

        // Adjust end times to prevent overlaps
        for (let i = 0; i < appointmentsArray.length - 1; i++) {
          const currentAppointment = appointmentsArray[i];
          const nextAppointment = appointmentsArray[i + 1];

          const currentEndTimeMs = new Date(`1970-01-01T${currentAppointment.endTime}:00`).getTime();
          const nextStartTimeMs = new Date(`1970-01-01T${nextAppointment.time}:00`).getTime();

          if (currentEndTimeMs > nextStartTimeMs) {
            // Adjust the end time of the current appointment
            currentAppointment.endTime = nextAppointment.time;
          }
        }

        setAppointments(appointmentsArray); // Update state with fetched and sorted data
      } else {
        setAppointments([]); // If no data, set appointments to an empty array
      }
    });
  }, []);

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        header: 'Customer',
        accessorKey: 'name', // Accessor is the "key" in the data
      },
      {
        header: 'Service',
        accessorKey: 'service',
      },
      {
        header: 'Time',
        accessorKey: 'time',
      },
      {
        header: 'End Time',
        accessorKey: 'endTime',
      },
      {
        header: 'Status',
        accessorKey: 'state',
        // Custom cell rendering for the Status column
        cell: (info) => {
          const state = info.getValue();
          let color = '';
          if (state === 'Ongoing') {
            color = 'green';
          } else if (state === 'Pending') {
            color = 'red';
          } else if (state === 'Accepted') {
            color = 'blue';
          }
          return <span style={{ color }}>{state}</span>;
        },
      },
    ],
    []
  );

  // Create a table instance
  const table = useReactTable({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Enable sorting
  });

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Add class when in view
          } else {
            entry.target.classList.remove('visible'); // Remove class when out of view
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    if (appointmentsRef.current) {
      observer.observe(appointmentsRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (appointmentsRef.current) observer.unobserve(appointmentsRef.current);
    };
  }, []);

  return (
    <section id="appointments" className="current-appointments" ref={appointmentsRef}>
      <h2>Current Appointments</h2>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼', // Sort ascending indicator
                    desc: ' 🔽', // Sort descending indicator
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Appointments;