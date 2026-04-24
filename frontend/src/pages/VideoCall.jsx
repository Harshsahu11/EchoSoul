import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { API_URL } from "../services/api";

const SOCKET_SERVER_URL = API_URL;

const VideoCall = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("token");
    if (!adminToken && !userToken) {
      toast.error("Please login before joining the call.");
      navigate("/login");
      return;
    }

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        pcRef.current = pc;

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit("signal", {
              type: "candidate",
              data: event.candidate,
            });
          }
        };

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        socketRef.current = io(SOCKET_SERVER_URL, {
          transports: ["websocket"],
        });

        socketRef.current.on("connect", () => {
          toast.success("Connected to call server.");
          socketRef.current.emit("join-room", { roomId: appointmentId });
          setIsReady(true);
        });

        socketRef.current.on("start-call", async ({ initiatorId }) => {
          if (socketRef.current.id === initiatorId) {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socketRef.current.emit("signal", {
              type: "offer",
              data: offer,
            });
          }
        });

        socketRef.current.on("signal", async ({ from, type, data }) => {
          if (!pcRef.current) return;

          if (type === "offer") {
            await pcRef.current.setRemoteDescription(
              new RTCSessionDescription(data),
            );
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            socketRef.current.emit("signal", {
              to: from,
              type: "answer",
              data: answer,
            });
          }

          if (type === "answer") {
            await pcRef.current.setRemoteDescription(
              new RTCSessionDescription(data),
            );
            setIsConnected(true);
            toast.success("Video call connected.");
          }

          if (type === "candidate") {
            try {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(data));
            } catch (e) {
              console.error("Error adding ICE candidate", e);
            }
          }
        });

        socketRef.current.on("peer-joined", () => {
          toast.info("Peer joined the room.");
        });

        const frontendUrl = window.location.origin;
        setMeetingLink(`${frontendUrl}/call/${appointmentId}`);
      } catch (error) {
        console.error(error);
        toast.error("Unable to start video call.");
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, [appointmentId, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.65)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
                Video Call Room
              </p>
              <h1 className="text-4xl font-semibold text-white">
                Live Session
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Join the meeting in your browser. Make sure camera and mic are
                enabled.
              </p>
            </div>
            <button
              onClick={() => navigate("/my-appointments")}
              className="rounded-full border border-white/10 bg-slate-800/90 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
            >
              Back to Appointments
            </button>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-400">Your Camera</p>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="mt-4 h-72 w-full rounded-3xl bg-black object-cover"
                  />
                </div>
                <div className="rounded-3xl bg-slate-900/70 p-4">
                  <p className="text-sm text-slate-400">Remote Video</p>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="mt-4 h-72 w-full rounded-3xl bg-black object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Meeting link
                </p>
                <p className="mt-3 text-slate-200 break-all">{meetingLink}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Status
                </p>
                <p className="mt-3 text-white">
                  {isConnected
                    ? "Connected"
                    : isReady
                      ? "Waiting for peer..."
                      : "Connecting..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
