import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { AuthClient } from "../../services/api";
import { message } from "antd";

type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string; // ✅ Added missing field
};

export default function UpdatePasswordForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm<ChangePasswordFormData>();

  // Handle form submission
  const onSubmit = async (data: ChangePasswordFormData) => {
    console.log("Change password submitted:", data);
    try {
      //  Await API call
      const res = await AuthClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if(!res || res.status!==200){
        message.error("Failed to change password. Please try again.")
      }
      message.success("Password changed successfully!");
      reset();
    } catch (error: any) {
      console.error("Failed to change password:", error);
      if (error?.response?.status === 401) {
      message.error("Old Password is Incorrect");
    } else {
      message.error("Failed to change password. Please try again.");
    }
  };
}

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Change Password</h2>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Old Password Field */}
        <Form.Group as={Row} className="mb-3" controlId="currentPassword">
          <Form.Label column sm={3} md={2} lg={2} className="text-start">
            Old Password
          </Form.Label>
          <Col sm={9} md={5} lg={4}>
            <Form.Control
              type="password"
              {...register("currentPassword", {
                required: "Old password is required",
              })}
              isInvalid={!!errors.currentPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.currentPassword?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        {/* New Password Field */}
        <Form.Group as={Row} className="mb-3" controlId="newPassword">
          <Form.Label column sm={3} md={2} lg={2} className="text-start">
            New Password
          </Form.Label>
          <Col sm={9} md={5} lg={4}>
            <Form.Control
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "New password must be at least 8 characters",
                },
              })}
              isInvalid={!!errors.newPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        {/* Confirm Password Field */}
        <Form.Group as={Row} className="mb-3" controlId="confirmPassword">
          <Form.Label column sm={3} md={2} lg={2} className="text-start">
            Confirm Password
          </Form.Label>
          <Col sm={9} md={5} lg={4}>
            <Form.Control
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Passwords must match",
              })}
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        {/* Buttons */}
        <div className="d-flex gap-2 mt-4">
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
