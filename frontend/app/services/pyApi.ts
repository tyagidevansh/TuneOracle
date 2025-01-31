const apiAddress = "http://127.0.0.1:8000"

export const post = async (route: string, data: any | null) => {
  const response = await fetch(`${apiAddress}${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`FASTAPI error! status: ${response.status}`);
  }

  return response.json();
}

export const get = async (route: string) => {
  const response = await fetch(`${apiAddress}${route}`, {
    method: 'GET',
    headers: {
      'Content-Type' : 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`FASTAPI error! status: ${response.status}`);
  }

  return response.json();
}