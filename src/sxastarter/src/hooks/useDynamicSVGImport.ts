import { useRef, useState, useEffect } from 'react';

interface UseDynamicSVGImportOptions {
  onCompleted?: (
    name: string,
    SvgIcon: React.FC<React.SVGProps<SVGSVGElement>> | undefined
  ) => void;
  onError?: (err: Error) => void;
}

export function useDynamicSVGImport(src: string, options: UseDynamicSVGImportOptions = {}) {
  const ImportedIconRef = useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const { onCompleted, onError } = options;
  useEffect(() => {
    setLoading(true);
    const importIcon = async (): Promise<void> => {
      try {
        console.log('Getting the SVG from', name);
        ImportedIconRef.current = (await import(src)).ReactComponent;
        onCompleted?.(src, ImportedIconRef.current);
      } catch (err) {
        console.log('Error getting the SVG from', src, err);
        onError?.(err as Error);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [src, onCompleted, onError]);

  return { error, loading, SvgIcon: ImportedIconRef.current };
}
