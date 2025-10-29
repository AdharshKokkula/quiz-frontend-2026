import { type ReactNode } from "react";

// Schools
import AddSchoolForm from "./features/schools/AddSchoolForm";
import BulkUpdate from "./features/schools/BulkUpdate";
import { SchoolTablePage } from "./pages/schools/SchoolTablePage";
import EditSchoolForm from "./features/schools/EditSchoolForm";
import ViewSchoolPage from "./pages/schools/ViewSchoolPage";

// Results
import ResultsIndex from "./pages/results/ResultsIndex";
import ResultsParticipants from "./pages/results/ResultsParticipants";
import ScreeningTestPage from "./pages/results/ScreeningTestPage";
import PreliminaryPage from "./pages/results/PreliminaryPage";
import SemiFinalsPage from "./pages/results/SemiFinalsPage";
import FinalsPage from "./pages/results/FinalsPage";
import AddResultsPage from "./pages/results/AddResults";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UnAuthorizedPage from "./pages/error/unAuthorized";

// Users
import ChangePasswordForm from "./features/users/ChangePasswordForm";
import { DeletedUsersPage } from "./pages/users/DeletedUsersPage";
import { UsersPage } from "./pages/users/UsersPage";
import AddUserForm from "./features/users/AddUserForm";
import EditUserForm from "./features/users/EditUserForm";


// Dashboard
import AdminDashboard from "./pages/home/AdminDashBoard";
import UpdatePasswordForm from "./pages/users/UpdatePasswordForm";

// Participants
import ParticipantTablePage from "./pages/participants/ParticipantTablePage";
import PendingPage from "./pages/participants/PendingPage";
import VerifiedPage from "./pages/participants/Verified";
import InactivePage from "./pages/participants/InactivePage";
import CSVUploadPage from "./pages/participants/CSVUploadPage";
import EditParticipant from "./features/participants/EditParticipant";

import RegisterParticipant from "./pages/schools/RegisterParticipant";
//import ResultTablePage from "./components/result/ResultTablePage";
export interface AppRoute {
  path: string;
  element: ReactNode;
  protected?: boolean;
  role?: string[];
  children?: AppRoute[];
}

export const routes: AppRoute[] = [
  // Public routes
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/unauthorized", element: <UnAuthorizedPage /> },

  // Admin routes
  {
    path: "/admin",
    element: <AdminDashboard />,
    protected: true,
    role: ["admin","moderator", "coordinator", "user"],
  },
  {
    path: "/schools",
    element: <SchoolTablePage />,
    protected: true,
    role: ["admin"],
  },
  {
    path: "/schools/add",
    element: <AddSchoolForm />,
    protected: true,
    role: ["admin"],
  },
  {
    path: "/admin/schools/:id/edit",
    element: <EditSchoolForm />,
    protected: true,
    role: ["admin"],
  },
  {
    path: "/bulk-update",
    element: <BulkUpdate />,
    protected: true,
    role: ["admin"],
  },

  {
    path: "/admin/bulk",
    element: <CSVUploadPage />,
    protected: true,
    role: ["admin"],
  },
  {
    path: "/schools/:schoolSlug/view",
    element: <ViewSchoolPage />,
    protected: true,
    role: ["admin"],
  },

  {
    path : "/admin/user/password",
    element: <UpdatePasswordForm/>,
    protected: true
  }
,
  // Results section (nested)
  {
    path: "/results",
    element: <ResultsIndex />,
    protected: true,
    role: ["admin"],
    children: [
      { path: "participants", element: <ResultsParticipants /> },
      { path: "screening-test", element: <ScreeningTestPage /> },
      { path: "preliminary", element: <PreliminaryPage /> },
      { path: "semi-finals", element: <SemiFinalsPage /> },
      { path: "finals", element: <FinalsPage /> },
      { path: "add", element: <AddResultsPage /> }
    ],
  },

  // Users
  {
    path: "/users",
    element: <UsersPage />,
    protected: true,
    role: ["admin"],
    children: [
      { path: "change-passwords", element: <ChangePasswordForm /> },
      { path: "deleted", element: <DeletedUsersPage /> },
       { path : "add" , element: <AddUserForm/>},
      { path : ":id/edit" , element: <EditUserForm/>}
    ],
  },

  // Participants (shared between Admin & Moderator)
  {
    path: "/participants/all",
    element: <ParticipantTablePage />,
    protected: true,
    role: ["admin", "moderator"],
  },

  {
    path: "/participants/:participantId",
    element: <EditParticipant />,
    protected: true,
    role: ["admin", "moderator"],
  },
  {
    path: "/participants/pending",
    element: <PendingPage />,
    protected: true,
    role: ["admin", "moderator"],
  },
  {
    path: "/participants/verified",
    element: <VerifiedPage />,
    protected: true,
    role: ["admin", "moderator"],
  },
  {
    path: "/participants/inactive",
    element: <InactivePage />,
    protected: true,
    role: ["admin", "moderator"],
  },
   {
    path: "/participants/:participantId/edit",
    element: <EditParticipant  />,
    protected: true,
    role: ["admin", "moderator"],
  },
   {
    path: "/schools/:schoolSlug/view/registerparticipant",
    element: <RegisterParticipant />,
    protected: true,
    role: ["admin", "moderator"],
  },
  //  {
  //   path: "/result",
  //   element: <ResultTablePage  />,
  //   protected: true,
  //   role: ["admin", "moderator"],
  // },
 

];
