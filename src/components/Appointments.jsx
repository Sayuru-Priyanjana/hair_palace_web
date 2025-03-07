import React, { useEffect, useRef, useState, useMemo } from 'react';
import '../styles/Appointments.css';
import { database, ref, onValue } from '../firebase'; 
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const DailyTable = ({ data, label }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Customer',
        accessorKey: 'name',
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
        cell: (info) => {
          const state = info.getValue();
          let color = '';
          if (state === 'Ongoing') color = 'green';
          else if (state === 'Pending') color = 'red';
          else if (state === 'Accepted') color = 'blue';
          return <span style={{ color }}>{state}</span>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="daily-table">
      <h3>{label}</h3>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
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
    </div>
  );
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const appointmentsRef = useRef(null);

  const toLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateEndTime = (startTime, duration) => {
    const startTimeMs = new Date(`1970-01-01T${startTime}:00`).getTime();
    const endTimeMs = startTimeMs + duration * 60000;
    return new Date(endTimeMs).toTimeString().slice(0, 5);
  };

  useEffect(() => {
    const appointmentsRef = ref(database, 'appointments');
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const appointmentsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          endTime: calculateEndTime(data[key].time, data[key].duration),
        }));
        setAppointments(appointmentsArray);
      } else {
        setAppointments([]);
      }
    });
  }, []);

  const processedGroups = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(tomorrow.getDate() + 1);

    const dates = {
      today: toLocalDateString(today),
      tomorrow: toLocalDateString(tomorrow),
      dayAfter: toLocalDateString(dayAfter),
    };

    const groups = {
      today: { date: dates.today, appointments: [] },
      tomorrow: { date: dates.tomorrow, appointments: [] },
      dayAfter: { date: dates.dayAfter, appointments: [] },
    };

    appointments.forEach((app) => {
      if (app.date === dates.today) groups.today.appointments.push(app);
      else if (app.date === dates.tomorrow) groups.tomorrow.appointments.push(app);
      else if (app.date === dates.dayAfter) groups.dayAfter.appointments.push(app);
    });

    Object.values(groups).forEach((group) => {
      group.appointments.sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.time}:00`).getTime();
        const timeB = new Date(`1970-01-01T${b.time}:00`).getTime();
        return timeA - timeB;
      });

      for (let i = 0; i < group.appointments.length - 1; i++) {
        const current = group.appointments[i];
        const next = group.appointments[i + 1];
        const currentEnd = new Date(`1970-01-01T${current.endTime}:00`).getTime();
        const nextStart = new Date(`1970-01-01T${next.time}:00`).getTime();

        if (currentEnd > nextStart) {
          current.endTime = next.time;
        }
      }
    });

    return groups;
  }, [appointments]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('visible', entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (appointmentsRef.current) observer.observe(appointmentsRef.current);
    return () => {
      if (appointmentsRef.current) observer.unobserve(appointmentsRef.current);
    };
  }, []);

  return (
    <section id="appointments" className="current-appointments" ref={appointmentsRef}>
      <h2>Current Appointments</h2>
      <DailyTable
        data={processedGroups.today.appointments}
        label={`Today (${processedGroups.today.date})`}
      />
      <DailyTable
        data={processedGroups.tomorrow.appointments}
        label={`Tomorrow (${processedGroups.tomorrow.date})`}
      />
      <DailyTable
        data={processedGroups.dayAfter.appointments}
        label={`Day After Tomorrow (${processedGroups.dayAfter.date})`}
      />
    </section>
  );
};

export default Appointments;