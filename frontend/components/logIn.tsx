import { Input } from "./ui/input";

interface LogInProps {
  setHeaders: (headers: string) => void;
}

export default function LogIn({ setHeaders }: LogInProps) {
  return (
    <div>
      <div className="text-white text-3xl text-center p-10">
        STEALING YOUR DATA or something idk rn
      </div>
      <div className="mt-16 w-[60%] mx-auto">
        <Input
          type="text"
          placeholder="Enter browser cookies 😈"
          onChange={(e) => setHeaders(e.target.value)} 
        />
      </div>
    </div>
  );
}
