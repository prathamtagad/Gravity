
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export const sendGapNotification = (minutes: number, startTime: string) => {
  if (Notification.permission === 'granted') {
    new Notification('Gravity Gap Detected! 🪐', {
      body: `You have a ${minutes} min gap starting at ${startTime}. Check Gravity for quests!`,
      icon: '/icon-192x192.png', // Assuming base icon exists
      tag: 'gravity-gap-alert'
    })
  }
}
