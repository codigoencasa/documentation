import { ImageResponse } from '@vercel/og';
export const config = {
  runtime: 'edge',
};
 
export default async function handler(request) {
    const { searchParams } = new URL(request.url);
    const hasTitle = searchParams.has('title');
    const title = hasTitle
        ? searchParams.get('title')?.slice(0, 100)
        : '';

    const imageData = await fetch(new URL('../../../public/assets/og-image-v4-blank.png', import.meta.url)).then(
        (res) => res.arrayBuffer(),
    );
 
    const fontData = await fetch(
        new URL('../../../public/fonts/DMSans-SemiBold.ttf', import.meta.url),
    ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: '#f6f6f6',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img style={{position:'absolute',zIndex:10}} width="1200" height="630" src={imageData} />
        <div style={{
                position:'absolute',
                zIndex:99, 
                right:10, 
                color:'white', 
                lineHeight:.8,
                textAlign:'center',
                display:'flex',
                justifyContent:'flex-start',
                fontFamily: '"Coolvetica"',
                fontSize: 80,
                width:680
              }}>
            {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Coolvetica',
          data: fontData,
          style: 'bold',
        },
      ],
    },
  );
}