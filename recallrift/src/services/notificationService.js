import toast from 'react-hot-toast';

class NotificationService {
  success(message, options = {}) {
    return toast.success(message, {
      duration: 3000,
      position: 'top-right',
      ...options
    });
  }

  error(message, options = {}) {
    return toast.error(message, {
      duration: 4000,
      position: 'top-right',
      ...options
    });
  }

  loading(message, options = {}) {
    return toast.loading(message, {
      position: 'top-right',
      ...options
    });
  }

  dismiss(toastId) {
    toast.dismiss(toastId);
  }

  promise(promise, messages, options = {}) {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong'
      },
      {
        position: 'top-right',
        ...options
      }
    );
  }

  custom(render, options = {}) {
    return toast.custom(render, {
      duration: 3000,
      position: 'top-right',
      ...options
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
