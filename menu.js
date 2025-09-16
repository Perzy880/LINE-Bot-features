function getMenu() {
  return {
    type: 'flex',
    altText: 'เมนูข้อมูลวันนี้',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'คุณต้องการดูข้อมูลอะไร?',
            weight: 'bold',
            size: 'lg',
            margin: 'md'
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: 'ราคาน้ำมัน',
              text: 'ราคาน้ำมัน'
            },
            style: 'primary',
            margin: 'md'
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: 'พยากรณ์อากาศ',
              text: 'อากาศวันนี้'
            },
            style: 'primary',
            margin: 'md'
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: 'ราคาทองคำ',
              text: 'ราคาทอง'
            },
            style: 'primary',
            margin: 'md'
          }
        ]
      }
    }
  };
}

module.exports = { getMenu };
