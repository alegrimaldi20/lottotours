// Native DOM-based notification system that bypasses React completely
// This avoids any locale-specific React rendering issues

interface NotificationOptions {
  title?: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

class NativeNotificationSystem {
  private container: HTMLElement | null = null;
  private notifications: Map<string, HTMLElement> = new Map();

  constructor() {
    this.createContainer();
  }

  private createContainer() {
    try {
      // Remove existing container if it exists
      const existing = document.getElementById('native-notifications');
      if (existing) {
        existing.remove();
      }

      // Create new container
      this.container = document.createElement('div');
      this.container.id = 'native-notifications';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        pointer-events: none;
        max-width: 400px;
        width: 100%;
      `;
      
      document.body.appendChild(this.container);
    } catch (error) {
      console.warn('Failed to create notification container:', error);
    }
  }

  show(options: NotificationOptions): string {
    try {
      if (!this.container) {
        this.createContainer();
      }

      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const notification = this.createNotification(id, options);
      
      if (notification && this.container) {
        this.notifications.set(id, notification);
        this.container.appendChild(notification);

        // Auto-remove after duration
        const duration = options.duration || 4000;
        setTimeout(() => {
          this.remove(id);
        }, duration);

        // Trigger animation
        requestAnimationFrame(() => {
          notification.style.transform = 'translateX(0)';
          notification.style.opacity = '1';
        });
      }

      return id;
    } catch (error) {
      console.warn('Failed to show notification:', error);
      return '';
    }
  }

  private createNotification(id: string, options: NotificationOptions): HTMLElement | null {
    try {
      const notification = document.createElement('div');
      notification.id = id;
      
      const bgColor = this.getBackgroundColor(options.type);
      const textColor = this.getTextColor(options.type);
      
      notification.style.cssText = `
        background: ${bgColor};
        color: ${textColor};
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: auto;
        position: relative;
        border-left: 4px solid ${this.getAccentColor(options.type)};
      `;

      const content = document.createElement('div');
      content.style.cssText = 'display: flex; align-items: flex-start; gap: 12px;';

      // Icon
      const icon = document.createElement('div');
      icon.innerHTML = this.getIcon(options.type);
      icon.style.cssText = 'flex-shrink: 0; margin-top: 2px;';

      // Text content
      const textContainer = document.createElement('div');
      textContainer.style.cssText = 'flex: 1; min-width: 0;';

      if (options.title) {
        const title = document.createElement('div');
        title.textContent = options.title;
        title.style.cssText = 'font-weight: 600; font-size: 14px; margin-bottom: 4px;';
        textContainer.appendChild(title);
      }

      if (options.message) {
        const message = document.createElement('div');
        message.textContent = options.message;
        message.style.cssText = 'font-size: 13px; opacity: 0.9;';
        textContainer.appendChild(message);
      }

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        background: none;
        border: none;
        color: ${textColor};
        font-size: 20px;
        line-height: 1;
        padding: 0;
        margin: 0;
        cursor: pointer;
        opacity: 0.7;
        flex-shrink: 0;
      `;
      closeBtn.onclick = () => this.remove(id);

      content.appendChild(icon);
      content.appendChild(textContainer);
      content.appendChild(closeBtn);
      notification.appendChild(content);

      return notification;
    } catch (error) {
      console.warn('Failed to create notification element:', error);
      return null;
    }
  }

  private getBackgroundColor(type?: string): string {
    switch (type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }

  private getTextColor(type?: string): string {
    return '#ffffff';
  }

  private getAccentColor(type?: string): string {
    switch (type) {
      case 'success': return '#059669';
      case 'error': return '#dc2626';
      case 'info': return '#2563eb';
      default: return '#4b5563';
    }
  }

  private getIcon(type?: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '⚠';
      case 'info': return 'ℹ';
      default: return '•';
    }
  }

  remove(id: string): void {
    try {
      const notification = this.notifications.get(id);
      if (notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
          this.notifications.delete(id);
        }, 300);
      }
    } catch (error) {
      console.warn('Failed to remove notification:', error);
    }
  }

  clear(): void {
    try {
      this.notifications.forEach((_, id) => this.remove(id));
    } catch (error) {
      console.warn('Failed to clear notifications:', error);
    }
  }
}

// Export singleton instance
export const nativeNotifications = new NativeNotificationSystem();

// Convenience functions
export const showSuccess = (title: string, message?: string) => 
  nativeNotifications.show({ title, message, type: 'success' });

export const showError = (title: string, message?: string) => 
  nativeNotifications.show({ title, message, type: 'error' });

export const showInfo = (title: string, message?: string) => 
  nativeNotifications.show({ title, message, type: 'info' });