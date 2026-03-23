import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, MailX } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type Status = 'loading' | 'valid' | 'already_unsubscribed' | 'invalid' | 'success' | 'error';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }
    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid === false && data.reason === 'already_unsubscribed') {
          setStatus('already_unsubscribed');
        } else if (data.valid) {
          setStatus('valid');
        } else {
          setStatus('invalid');
        }
      })
      .catch(() => setStatus('invalid'));
  }, [token]);

  const handleUnsubscribe = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-10 h-10 text-primary mx-auto animate-spin" />
              <p className="text-muted-foreground">Validating your request...</p>
            </>
          )}
          {status === 'valid' && (
            <>
              <MailX className="w-10 h-10 text-muted-foreground mx-auto" />
              <h1 className="text-xl font-semibold text-foreground">Unsubscribe</h1>
              <p className="text-muted-foreground text-sm">
                Are you sure you want to unsubscribe from Recovery & Wealth emails?
              </p>
              <Button onClick={handleUnsubscribe} disabled={processing} className="w-full">
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Confirm Unsubscribe
              </Button>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="w-10 h-10 text-primary mx-auto" />
              <h1 className="text-xl font-semibold text-foreground">Unsubscribed</h1>
              <p className="text-muted-foreground text-sm">
                You've been successfully unsubscribed. You won't receive any more emails from us.
              </p>
            </>
          )}
          {status === 'already_unsubscribed' && (
            <>
              <CheckCircle className="w-10 h-10 text-muted-foreground mx-auto" />
              <h1 className="text-xl font-semibold text-foreground">Already Unsubscribed</h1>
              <p className="text-muted-foreground text-sm">
                You've already been unsubscribed from our emails.
              </p>
            </>
          )}
          {status === 'invalid' && (
            <>
              <XCircle className="w-10 h-10 text-destructive mx-auto" />
              <h1 className="text-xl font-semibold text-foreground">Invalid Link</h1>
              <p className="text-muted-foreground text-sm">
                This unsubscribe link is invalid or has expired.
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="w-10 h-10 text-destructive mx-auto" />
              <h1 className="text-xl font-semibold text-foreground">Something Went Wrong</h1>
              <p className="text-muted-foreground text-sm">
                Please try again or contact us at ryan@recoveryandwealth.com.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
