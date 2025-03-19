import moment from 'moment';

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

export const formatDate = (date) => {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
}


export const getStatusClasses = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-500';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-500';
      case 'Paused':
        return 'bg-red-100 text-red-500';
      case 'Upcoming':
        return 'bg-purple-100 text-purple-500';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

export const formStatusClasses = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-500 dark:bg-green-500 dark:text-white';
      case 'draft':
        return 'bg-blue-100 text-blue-500 dark:bg-blue-500 dark:text-white';
      default:
        return 'bg-gray-100 text-gray-500 dark:bg-gray-500 dark:text-white';
    }
  };