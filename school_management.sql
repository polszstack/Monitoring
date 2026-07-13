-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 13, 2026 at 06:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `daily_attendance`
--

CREATE TABLE `daily_attendance` (
  `id` int(11) NOT NULL,
  `schedule_template_id` int(11) DEFAULT NULL,
  `teacher_id` int(11) NOT NULL,
  `attendance_date` date NOT NULL,
  `day_of_week` varchar(20) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `subject` varchar(100) NOT NULL,
  `room` varchar(50) DEFAULT NULL,
  `grade_level` varchar(50) DEFAULT NULL,
  `section` varchar(50) DEFAULT NULL,
  `attendance_status` enum('pending','present','absent','late','excused') DEFAULT 'pending',
  `time_marked` time DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `marked_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `verification_photo` varchar(255) DEFAULT NULL,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daily_attendance`
--

INSERT INTO `daily_attendance` (`id`, `schedule_template_id`, `teacher_id`, `attendance_date`, `day_of_week`, `start_time`, `end_time`, `subject`, `room`, `grade_level`, `section`, `attendance_status`, `time_marked`, `remarks`, `marked_by`, `created_at`, `updated_at`, `verification_photo`, `is_archived`) VALUES
(2, 5, 2, '2026-07-13', 'Monday', '09:00:00', '10:00:00', 'dawdawd', '234', '23423', 'efsfdfdsf', 'pending', NULL, NULL, NULL, '2026-07-13 04:36:57', '2026-07-13 04:36:57', NULL, 0),
(3, 5, 2, '2026-07-20', 'Monday', '09:00:00', '10:00:00', 'dawdawd', '234', '23423', 'efsfdfdsf', 'pending', NULL, NULL, NULL, '2026-07-13 04:36:57', '2026-07-13 04:36:57', NULL, 0),
(4, 5, 2, '2026-07-27', 'Monday', '09:00:00', '10:00:00', 'dawdawd', '234', '23423', 'efsfdfdsf', 'pending', NULL, NULL, NULL, '2026-07-13 04:36:57', '2026-07-13 04:36:57', NULL, 0),
(5, 5, 2, '2026-08-03', 'Monday', '09:00:00', '10:00:00', 'dawdawd', '234', '23423', 'efsfdfdsf', 'pending', NULL, NULL, NULL, '2026-07-13 04:36:57', '2026-07-13 04:36:57', NULL, 0),
(6, 5, 2, '2026-08-10', 'Monday', '09:00:00', '10:00:00', 'dawdawd', '234', '23423', 'efsfdfdsf', 'pending', NULL, NULL, NULL, '2026-07-13 04:36:57', '2026-07-13 04:36:57', NULL, 0),
(7, 6, 6, '2026-07-14', 'Tuesday', '07:00:00', '08:00:00', 'awdwadadw', '3423', '4234', 'sfsdfs', 'pending', NULL, NULL, NULL, '2026-07-13 04:37:35', '2026-07-13 04:37:35', NULL, 0),
(8, 6, 6, '2026-07-21', 'Tuesday', '07:00:00', '08:00:00', 'awdwadadw', '3423', '4234', 'sfsdfs', 'pending', NULL, NULL, NULL, '2026-07-13 04:37:35', '2026-07-13 04:37:35', NULL, 0),
(9, 6, 6, '2026-07-28', 'Tuesday', '07:00:00', '08:00:00', 'awdwadadw', '3423', '4234', 'sfsdfs', 'pending', NULL, NULL, NULL, '2026-07-13 04:37:35', '2026-07-13 04:37:35', NULL, 0),
(10, 6, 6, '2026-08-04', 'Tuesday', '07:00:00', '08:00:00', 'awdwadadw', '3423', '4234', 'sfsdfs', 'pending', NULL, NULL, NULL, '2026-07-13 04:37:35', '2026-07-13 04:37:35', NULL, 0),
(11, 6, 6, '2026-08-11', 'Tuesday', '07:00:00', '08:00:00', 'awdwadadw', '3423', '4234', 'sfsdfs', 'pending', NULL, NULL, NULL, '2026-07-13 04:37:35', '2026-07-13 04:37:35', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `facility_inventory`
--

CREATE TABLE `facility_inventory` (
  `id` int(11) NOT NULL,
  `item_code` varchar(50) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `category` enum('furniture','electrical','plumbing','electronics','structural','other') NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `room_number` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `condition_status` enum('good','fair','poor','broken') DEFAULT 'good',
  `purchase_date` date DEFAULT NULL,
  `purchase_cost` decimal(10,2) DEFAULT NULL,
  `last_maintenance_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facility_inventory`
--

INSERT INTO `facility_inventory` (`id`, `item_code`, `item_name`, `category`, `description`, `location`, `room_number`, `quantity`, `condition_status`, `purchase_date`, `purchase_cost`, `last_maintenance_date`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'FRN-001', 'Teacher Chair', 'furniture', NULL, 'Main Building', 'Room 101', 25, 'good', NULL, NULL, NULL, NULL, '2026-07-06 11:41:35', '2026-07-06 11:41:35'),
(2, 'FRN-002', 'Student Desk', 'furniture', NULL, 'Main Building', 'Room 101', 50, 'good', NULL, NULL, NULL, NULL, '2026-07-06 11:41:35', '2026-07-06 11:41:35'),
(3, 'ELC-001', 'Electric Fan', 'electrical', NULL, 'Main Building', 'Room 101', 4, 'good', NULL, NULL, NULL, NULL, '2026-07-06 11:41:35', '2026-07-06 11:41:35'),
(4, 'ELC-002', 'LED Light', 'electrical', NULL, 'Main Building', 'Room 101', 8, 'good', NULL, NULL, NULL, NULL, '2026-07-06 11:41:35', '2026-07-06 11:41:35'),
(5, 'FRN-003', 'Teacher Table', 'furniture', NULL, 'Main Building', 'Room 102', 1, 'fair', NULL, NULL, NULL, NULL, '2026-07-06 11:41:35', '2026-07-06 11:41:35'),
(6, 'ELC-003', 'Air Conditioner', 'electrical', NULL, 'Main Building', 'Room 201', 2, 'good', NULL, NULL, NULL, NULL, '2026-07-06 11:41:35', '2026-07-06 11:41:35'),
(7, 'FRN-004', 'Whiteboard', 'furniture', NULL, 'Main Building', 'Room 102', 1, 'good', NULL, NULL, NULL, NULL, '2026-07-06 11:41:35', '2026-07-06 11:41:35'),
(8, 'ELC-004', 'Projector', 'electronics', NULL, 'Main Building', 'Room 201', 1, 'fair', NULL, NULL, NULL, NULL, '2026-07-06 11:41:35', '2026-07-06 11:41:35');

-- --------------------------------------------------------

--
-- Table structure for table `facility_reports`
--

CREATE TABLE `facility_reports` (
  `id` int(11) NOT NULL,
  `report_number` varchar(20) NOT NULL,
  `facility_type` enum('furniture','electrical','plumbing','electronics','structural','other') NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `item_description` text DEFAULT NULL,
  `location` varchar(100) NOT NULL,
  `room_number` varchar(50) DEFAULT NULL,
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `status` enum('reported','in_progress','fixed','cannot_fix','cancelled') DEFAULT 'reported',
  `is_archived` tinyint(1) NOT NULL DEFAULT 0,
  `reported_by` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `reported_date` datetime NOT NULL DEFAULT current_timestamp(),
  `fixed_date` datetime DEFAULT NULL,
  `cost_estimate` decimal(10,2) DEFAULT NULL,
  `actual_cost` decimal(10,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facility_reports`
--

INSERT INTO `facility_reports` (`id`, `report_number`, `facility_type`, `item_name`, `item_description`, `location`, `room_number`, `priority`, `status`, `is_archived`, `reported_by`, `assigned_to`, `reported_date`, `fixed_date`, `cost_estimate`, `actual_cost`, `notes`, `image_path`, `created_at`, `updated_at`) VALUES
(1, 'RPT-001', 'furniture', 'reswtert', 'sdfdsf', 'ertdergt', '5345', 'high', 'reported', 1, 1, NULL, '2026-07-07 20:58:03', NULL, NULL, NULL, 'adwadrfas', NULL, '2026-07-07 12:58:03', '2026-07-10 14:40:11'),
(2, 'RPT-002', 'electrical', 'Air Conditioner', NULL, 'Main Building', 'Room 201', 'medium', 'reported', 1, 1, NULL, '2026-07-07 21:02:08', NULL, NULL, NULL, NULL, NULL, '2026-07-07 13:02:08', '2026-07-10 14:40:12'),
(3, 'REP-632224', 'furniture', 'table', 'dwaddawd', 'Main Building', 'Room 201', 'medium', 'reported', 1, 1, NULL, '2026-07-10 22:39:13', NULL, NULL, NULL, '', NULL, '2026-07-10 14:39:13', '2026-07-10 15:33:36'),
(4, 'REP-866419', 'furniture', 'chair', 'dwadawdawdaw', 'Main Building', 'Room 102', 'high', 'reported', 1, 1, NULL, '2026-07-10 22:58:53', NULL, NULL, NULL, '', NULL, '2026-07-10 14:58:53', '2026-07-10 15:33:53'),
(5, 'REP-377116', 'furniture', 'table', 'broken legs', 'Main Building', 'Room 201', 'medium', 'reported', 1, 1, NULL, '2026-07-10 22:59:15', NULL, NULL, NULL, '', NULL, '2026-07-10 14:59:15', '2026-07-10 15:33:36');

-- --------------------------------------------------------

--
-- Table structure for table `schedule_templates`
--

CREATE TABLE `schedule_templates` (
  `id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `subject` varchar(100) NOT NULL,
  `room` varchar(50) DEFAULT NULL,
  `grade_level` varchar(50) DEFAULT NULL,
  `section` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedule_templates`
--

INSERT INTO `schedule_templates` (`id`, `teacher_id`, `day_of_week`, `start_time`, `end_time`, `subject`, `room`, `grade_level`, `section`, `created_at`, `updated_at`) VALUES
(4, 1, 'Monday', '07:00:00', '08:00:00', 'dawdawd', '4234', '4234', 'dfghdfghd', '2026-07-13 04:26:53', '2026-07-13 04:26:53'),
(5, 2, 'Monday', '09:00:00', '10:00:00', 'dawdawd', '234', '23423', 'efsfdfdsf', '2026-07-13 04:36:57', '2026-07-13 04:36:57'),
(6, 6, 'Tuesday', '07:00:00', '08:00:00', 'awdwadadw', '3423', '4234', 'sfsdfs', '2026-07-13 04:37:35', '2026-07-13 04:37:35');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `employee_id` varchar(20) NOT NULL,
  `department` varchar(50) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `user_id`, `employee_id`, `department`, `position`, `contact_number`, `address`, `created_at`, `updated_at`) VALUES
(1, 12, '6', 'General', NULL, NULL, NULL, '2026-07-13 04:11:55', '2026-07-13 04:11:55'),
(2, 13, '4', 'General', NULL, NULL, NULL, '2026-07-13 04:13:10', '2026-07-13 04:13:10'),
(6, 17, 'TCH-1783916363713', 'General', NULL, NULL, NULL, '2026-07-13 04:19:23', '2026-07-13 04:19:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('admin','teacher','staff') NOT NULL DEFAULT 'teacher',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2', 'admin@school.com', 'System Administrator', 'admin', 'active', '2026-07-04 12:26:53', '2026-07-07 12:08:35'),
(2, 'john.doe', '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2', 'john.doe@school.com', 'John Doe', 'teacher', 'active', '2026-07-04 12:26:53', '2026-07-07 12:08:35'),
(3, 'jane.smith', '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2', 'jane.smith@school.com', 'Jane Smith', 'teacher', 'active', '2026-07-04 12:26:53', '2026-07-07 12:08:35'),
(4, 'kevindurant', '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2', 'kevindurant@school.com', 'Kevin Durant', 'teacher', 'active', '2026-07-13 04:07:53', '2026-07-13 04:07:53'),
(12, 'kevindurant1783915915061', '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2', 'kevindurant1783915915061@school.com', 'Kevin Durant', 'teacher', 'active', '2026-07-13 04:11:55', '2026-07-13 04:11:55'),
(13, 'stephencurry', '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2', 'stephencurry@school.com', 'Stephen Curry', 'teacher', 'active', '2026-07-13 04:13:10', '2026-07-13 04:13:10'),
(14, 'lebronjames', '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2', 'lebronjames@school.com', 'Lebron James', 'teacher', 'active', '2026-07-13 04:17:55', '2026-07-13 04:17:55'),
(15, 'lebronjames1783916276847', '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2', 'lebronjames1783916276847@school.com', 'Lebron James', 'teacher', 'active', '2026-07-13 04:17:56', '2026-07-13 04:17:56'),
(16, 'lebronjames1783916312262', '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2', 'lebronjames1783916312262@school.com', 'Lebron James', 'teacher', 'active', '2026-07-13 04:18:32', '2026-07-13 04:18:32'),
(17, 'lebronjames1783916363708', '$2b$10$HpSkMednR0vMANWGOtOSUuWs1NM1cX4aaJTKREiTyKWtWThJvjRI2', 'lebronjames1783916363708@school.com', 'Lebron James', 'teacher', 'active', '2026-07-13 04:19:23', '2026-07-13 04:19:23');

-- --------------------------------------------------------

--
-- Table structure for table `visitor_logs`
--

CREATE TABLE `visitor_logs` (
  `id` int(11) NOT NULL,
  `visitor_name` varchar(100) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `purpose_of_visit` text NOT NULL,
  `person_to_visit` varchar(100) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `check_in_time` datetime NOT NULL,
  `check_out_time` datetime DEFAULT NULL,
  `id_proof_type` varchar(50) DEFAULT NULL,
  `id_proof_number` varchar(50) DEFAULT NULL,
  `vehicle_number` varchar(20) DEFAULT NULL,
  `badge_number` varchar(20) DEFAULT NULL,
  `status` enum('checked_in','checked_out') DEFAULT 'checked_in',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_archived` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visitor_logs`
--

INSERT INTO `visitor_logs` (`id`, `visitor_name`, `contact_number`, `email`, `purpose_of_visit`, `person_to_visit`, `department`, `check_in_time`, `check_out_time`, `id_proof_type`, `id_proof_number`, `vehicle_number`, `badge_number`, `status`, `notes`, `created_at`, `updated_at`, `is_archived`) VALUES
(1, 'juan pablo corre', '35345', 'correjuanpablo05@gmail.com', 'sdfdsf', 'sdfs', 'adwad', '2026-07-07 07:41:26', '2026-07-10 23:06:30', 'Passport', 'r345543', 'fdsfdsf', 'V-2026-0001', 'checked_out', 'dsfds', '2026-07-06 23:41:26', '2026-07-10 15:23:29', 1),
(2, 'juan pablo corre', '345345', 'correjuanpablo05@gmail.com', 'sdgfsgds', 'sdfsdf', 'efrefr', '2026-07-07 07:41:47', '2026-07-10 23:06:35', 'Driver\'s License', '534535', 'dsfsfsddf', 'V-2026-0002', 'checked_out', 'dfsfsdf', '2026-07-06 23:41:47', '2026-07-10 15:23:28', 1),
(3, 'asdadasd', '5435', 'correjuanpablo05@gmail.com', 'dsfsf', 'sfdsfds', 'sdfsfs', '2026-07-07 07:46:14', '2026-07-10 23:06:02', 'Passport', '645645645', 'dsfsfdsf', 'V-2026-0003', 'checked_out', 'dfsfs', '2026-07-06 23:46:14', '2026-07-10 15:23:25', 1),
(4, 'juan pablo corre', '5345', 'correjuanpablo05@gmail.com', 'dfgdfg', 'dfgdg', 'dgdgfg', '2026-07-07 07:50:04', '2026-07-10 23:06:26', 'Driver\'s License', '46456', '645646', 'V-2026-0004', 'checked_out', 'gfdgdf', '2026-07-06 23:50:04', '2026-07-10 15:23:23', 1),
(5, 'juan pablo corre', '2342353', 'correjuanpablo05@gmail.com', 'fgddfg', 'dfgdfg', 'Other', '2026-07-07 21:02:46', '2026-07-10 23:05:51', 'National ID', '56456', '4645', NULL, 'checked_out', 'gdgdfg', '2026-07-07 13:02:46', '2026-07-10 15:17:48', 1),
(6, 'Kevin Durant', '34245235', 'kevindurant@gmail.com', 'dfssfds', 'dfssdfds', 'Registrar', '2026-07-07 21:43:49', '2026-07-08 09:43:25', 'National ID', '234345', '234', NULL, 'checked_out', 'dfgdfgdr', '2026-07-07 13:43:49', '2026-07-10 15:17:38', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daily_attendance`
--
ALTER TABLE `daily_attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_daily_attendance` (`teacher_id`,`attendance_date`,`start_time`),
  ADD KEY `schedule_template_id` (`schedule_template_id`),
  ADD KEY `marked_by` (`marked_by`),
  ADD KEY `idx_attendance_date` (`attendance_date`),
  ADD KEY `idx_is_archived` (`is_archived`),
  ADD KEY `idx_date_archived` (`attendance_date`,`is_archived`);

--
-- Indexes for table `facility_inventory`
--
ALTER TABLE `facility_inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_code` (`item_code`);

--
-- Indexes for table `facility_reports`
--
ALTER TABLE `facility_reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `report_number` (`report_number`),
  ADD KEY `reported_by` (`reported_by`),
  ADD KEY `assigned_to` (`assigned_to`);

--
-- Indexes for table `schedule_templates`
--
ALTER TABLE `schedule_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_schedule` (`teacher_id`,`day_of_week`,`start_time`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `visitor_logs`
--
ALTER TABLE `visitor_logs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `daily_attendance`
--
ALTER TABLE `daily_attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `facility_inventory`
--
ALTER TABLE `facility_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `facility_reports`
--
ALTER TABLE `facility_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `schedule_templates`
--
ALTER TABLE `schedule_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `visitor_logs`
--
ALTER TABLE `visitor_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `daily_attendance`
--
ALTER TABLE `daily_attendance`
  ADD CONSTRAINT `daily_attendance_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `daily_attendance_ibfk_2` FOREIGN KEY (`schedule_template_id`) REFERENCES `schedule_templates` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `daily_attendance_ibfk_3` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `schedule_templates`
--
ALTER TABLE `schedule_templates`
  ADD CONSTRAINT `schedule_templates_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
